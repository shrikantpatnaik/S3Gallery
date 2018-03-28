import { Meteor } from 'meteor/meteor';
import { AWS } from 'meteor/peerlibrary:aws-sdk';

import s3ls from 's3-ls';
import _ from 'lodash';
import exifToolBin from 'dist-exiftool';
import Exif from 'simple-exiftool';
import rp from 'request-promise';

import { Albums } from './albums.js';

import { Photos } from './photos.js';


if (!Meteor.settings.AWS) {
  throw (new Meteor.Error('AWS Settings must be specified'));
}

const bucketName = Meteor.settings.AWS.s3BucketName;
const mainFolder = Meteor.settings.AWS.s3BucketMainFolder;

AWS.config.update({
  accessKeyId: Meteor.settings.AWS.accessKeyId,
  secretAccessKey: Meteor.settings.AWS.secretAccessKey,
});

const s3 = new AWS.S3();
const lister = s3ls({ bucket: bucketName, s3 });

const params = {
  Bucket: bucketName,
};

function getEXIFFromBinary(data) {
  return new Promise(function(resolve, reject) {
    Exif(data, { binary: exifToolBin, args: ['-json', '-s', '-iptc:all', '-exif:all'] }, (error, metadata) => {
      if (error) {
        reject(error);
      } else {
        const keysToExclude = [
          'ThumbnailOffset',
          'ThumbnailLength',
          'ThumbnailImage',
        ];
        resolve(_.omit(metadata, keysToExclude));
      }
    });
  });
}

async function getExifDataAsync(photo) {
  try {
    const url = encodeURI(`http://${Meteor.settings.public.photosBaseUrl}/${photo.key}`);
    const response = await rp({
      uri: url,
      encoding: null,
    });
    const tags = await getEXIFFromBinary(response);
    return tags;
  } catch (err) {
    return null;
  }
}

async function insertPhotoIfDoesntExist(key, albumId) {
  const photoParams = {
    key,
    albumId,
  };
  let photo = Photos.findOne(photoParams);
  if (!photo) {
    const newId = Photos.insert(photoParams);
    photo = Photos.findOne(newId);
  }
  if (!photo.metadata) {
    const exifData = await getExifDataAsync(photo);
    Photos.update(photo._id, {
      $set: {
        metadata: exifData,
      },
    });
  }
}

function insertKeysIntoAlbum(s3params, albumId) {
  const data = s3.listObjectsV2Sync(s3params);
  _.forEach(data.Contents, function(object) {
    if (Meteor.settings.public.AWS.s3LowQualityFolderName) {
      if (_.includes(object.Key, Meteor.settings.public.AWS.s3LowQualityFolderName)) {
        insertPhotoIfDoesntExist(object.Key, albumId);
      }
    } else {
      insertPhotoIfDoesntExist(object.Key, albumId);
    }
  });

  if (data.isTruncated) {
    params.ContinuationToken = data.NextContinuationToken;
    insertKeysIntoAlbum(params);
  } else if (params.ContinuationToken) {
    delete params.ContinuationToken;
  }
}

function insertOrFindAlbum(albumName) {
  const album = Albums.findOne({ name: albumName });
  if (album) {
    return album._id;
  }
  return Albums.insert({ name: albumName });
}

async function updateFromAws() {
  await lister.ls(`/${mainFolder}`).then((data) => {
    _.forEach(data.folders, function(folder) {
      params.Prefix = folder;
      const folderName = _.trim(_.replace(folder, mainFolder, ''), '/');
      const albumId = insertOrFindAlbum(folderName);
      insertKeysIntoAlbum(params, albumId);
      const album = Albums.findOne(albumId);
      if (!album.featuredImageKey) {
        Albums.update({ _id: albumId }, {
          $set: {
            featuredImageKey: Photos.findOne({ albumId }).key,
          },
        });
      }
    });
  });
}


if (Meteor.isServer) {
  Meteor.methods({
    'aws.update'() {
      updateFromAws();
    },
  });
}

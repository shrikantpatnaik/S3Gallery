import { Meteor } from 'meteor/meteor';

import { Albums } from './albums.js'

import { Photos } from './photos.js'

import s3ls from 's3-ls'
import _ from 'lodash'
import exifToolBin from 'dist-exiftool'
import Exif from 'simple-exiftool'
import rp from 'request-promise'



if(Meteor.isServer){
  if(!Meteor.settings.AWS) {
    throw (new Meteor.Error("AWS Settings must be specified"));
  }

  var bucketName = Meteor.settings.AWS.s3BucketName;
  var mainFolder = Meteor.settings.AWS.s3BucketMainFolder;

  AWS.config.update({
    accessKeyId: Meteor.settings.AWS.accessKeyId,
    secretAccessKey: Meteor.settings.AWS.secretAccessKey,
  })

  var s3 = new AWS.S3()
  var lister = s3ls({bucket: bucketName, s3: s3});

  var params = {
    Bucket: bucketName
  };

  function insertKeysIntoAlbum(params, albumId) {
    var data = s3.listObjectsV2Sync(params);
    _.forEach(data.Contents, function(object) {
      if(Meteor.settings.public.AWS.s3LowQualityFolderName) {
        if(_.includes(object.Key, Meteor.settings.public.AWS.s3LowQualityFolderName)) {
          insertPhotoIfDoesntExist(object.Key, albumId)
        }
      } else {
        insertPhotoIfDoesntExist(object.Key, albumId)
      }
    })

    if(data.isTruncated) {
      params.ContinuationToken = data.NextContinuationToken;
      insertKeysIntoAlbum(params);
    } else {
      if(params.ContinuationToken) {
        delete params.ContinuationToken
      }
    }
  }
  async function insertPhotoIfDoesntExist(key, albumId) {
    var photoParams = {
      key: key,
      albumId: albumId,
    }
    var photo = Photos.findOne(photoParams);
    if(!photo) {
      var newId = Photos.insert(photoParams);
      photo = Photos.findOne(newId);
    }
    if(!photo.metadata) {
      var exifData = await getExifDataAsync(photo);
      Photos.update(photo._id, {
        $set: {
          metadata: exifData
        }
      })
    }
  }
  function insertOrFindAlbum(albumName) {
    var album = Albums.findOne({name: albumName});
    if(album) {
      return album._id;
    } else {
      return Albums.insert({name: albumName})
    }
  }

  function updateFromAws() {
    console.log("aws update start");
    lister.ls("/"+mainFolder).then((data) => {
      _.forEach(data.folders, function(folder) {
        params.Prefix = folder;
        var folderName = _.trim(_.replace(folder, mainFolder, ''), '/');
        var albumId = insertOrFindAlbum(folderName);
        insertKeysIntoAlbum(params, albumId);
        var album = Albums.findOne(albumId)
        if(!album.featuredImageKey) {
          Albums.update({_id:albumId}, {$set:{
            featuredImageKey: Photos.findOne({albumId: albumId}).key
          }});
        }
      })
      console.log("aws update complete");
    })
    .catch(console.error);
  }

  async function getExifDataAsync(photo) {
    try {
      var url = encodeURI("http://"+Meteor.settings.public.photosBaseUrl+"/"+photo.key);
      var response = await rp({
        uri: url,
        encoding: null,
      });
      var tags = await getEXIFFromBinary(response)
      return tags;
    } catch(err) {
      console.log("Error: %s", err);
    }
  }

  function getEXIFFromBinary(data) {
    return new Promise(function(resolve, reject) {
      Exif(data, {binary: exifToolBin, args:["-json", "-s", "-iptc:all", "-exif:all"]}, (error, metadata) => {
        if (error) {
          reject(error);
        } else {
          var keysToExclude = [
            'ThumbnailOffset',
            'ThumbnailLength',
            'ThumbnailImage'
          ]
          resolve(_.omit(metadata, keysToExclude));
        }
      });
    })
  }

  Meteor.methods({
    'aws.update'() {
      updateFromAws();
    },
  })
}

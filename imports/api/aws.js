import { Meteor } from 'meteor/meteor';

import { Albums } from './albums.js'

import { Photos } from './photos.js'

import s3ls from 's3-ls'
import _ from 'lodash'



if(Meteor.isServer){
  if(!Meteor.settings.AWS) {
    throw (new Meteor.Error("AWS Settings must be specified"));
  }

  var bucketName = Meteor.settings.AWS.s3BucketName;
  var mainFolder = Meteor.settings.AWS.s3s3BucketMainFolder;

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
      if(Meteor.settings.AWS.s3LowQualityFolderName) {
        if(_.includes(object.Key, Meteor.settings.AWS.s3LowQualityFolderName)) {
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
  function insertPhotoIfDoesntExist(key, albumId) {
    var photoParams = {
      key: key,
      albumId: albumId,
    }
    var photo = Photos.findOne(photoParams);
    if(!photo) {
      Photos.insert(photoParams);
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

  Meteor.methods({
    'aws.update'() {
      updateFromAws();
    },
  })
}

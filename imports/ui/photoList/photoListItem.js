import { Template } from 'meteor/templating';

import _ from 'lodash'

import './photoListItem.html';

import './photoListItem.css';

Template.photoListItem.helpers({
  thumbUrl() {
    return "//" + Meteor.settings.public.photosBaseUrl + "/" + encodeURI(this.photo.key);
  },
  imageUrl() {
    return "//" + Meteor.settings.public.photosBaseUrl + "/" + _.replace(encodeURI(this.photo.key), Meteor.settings.public.s3LowQualityFolderName, Meteor.settings.public.s3HighQualityFolderName);
  },
  isVideo() {
    return _.endsWith(this.photo.key, ".mp4")
  }
});


// import EXIF from 'exif-js'
// Template.photoListItem.events({
//   'load img': function(e, templateInstance) {
//     EXIF.getData(e.target, function() {
//       console.log("hello")
//       console.log(EXIF.getAllTags(this));
//       console.log(EXIF.getAllIptcTags(this));
//     })
//   }
// })

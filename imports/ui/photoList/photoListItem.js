import { Template } from 'meteor/templating';

import _ from 'lodash'

import './photoListItem.html';

import './photoListItem.css';

Template.photoListItem.helpers({
  thumbUrl() {
    return "//images.shrikantpatnaik.photography/"+encodeURI(this.photo.key);
  },
  imageUrl() {
    return "//images.shrikantpatnaik.photography/"+encodeURI(this.photo.key).replace("LowQ", "HighQ");
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

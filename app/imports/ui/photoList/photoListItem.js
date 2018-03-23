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

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../common/jquery.justifiedGallery.min.js';
import '../common/justifiedGallery.min.css';

import './albumListItem.html';

import './albumListItem.css';

Template.albumListItem.helpers({
  featuredImageUrl() {
    return `//${Meteor.settings.public.photosBaseUrl}/${encodeURI(this.album.featuredImageKey)}`;
  },
});

Template.albumListItem.onRendered(function() {
  if (this.data.albumIndex === this.data.pagination.getPage().length - 1) {
    $('#albumListDiv').justifiedGallery({
      rowHeight: 200,
    });
  }
});

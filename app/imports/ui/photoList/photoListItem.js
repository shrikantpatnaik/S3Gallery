import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import _ from 'lodash';

import './jquery.justifiedGallery.min.js';
import './jquery.colorbox.min.js';
import './justifiedGallery.min.css';

import './photoListItem.html';

import './photoListItem.css';
import './colorbox.css';

Template.photoListItem.helpers({
  thumbUrl() {
    return `//${Meteor.settings.public.photosBaseUrl}/${encodeURI(this.photo.key)}`;
  },
  imageUrl() {
    return `//${Meteor.settings.public.photosBaseUrl}/${_.replace(encodeURI(this.photo.key), Meteor.settings.public.s3LowQualityFolderName, Meteor.settings.public.s3HighQualityFolderName)}`;
  },
});

Template.photoListItem.onRendered(function() {
  if (this.data.photoIndex === this.data.pagination.getPage().length - 1) {
    $('#photoGalleryDiv').justifiedGallery({
      rowHeight: 200,
      rel: 'gallery1',
    }).on('jg.complete', function () {
      $(this).find('a').colorbox({
        maxWidth: '80%',
        maxHeight: '80%',
        opacity: 0.8,
        transition: 'elastic',
        current: '',
        loop: false,
        title() {
          const title = $(this).attr('title');
          return `${title} <span data-tippy-trigger="mouseenter" id="cboxInfo"><img src="/info_icon.png"/></span>`;
        },
      });
    });
  }
});

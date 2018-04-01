import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Blaze } from 'meteor/blaze';

import tippy from 'tippy.js';

import { Photos } from '../../api/photos.js';

import '../paginator/paginator.js';
import './photoListItem.js';
import './photoInfo.js';

import './photoList.html';

import './photoList.css';

Template.photoList.onCreated(function bodyOnCreated() {
  this.limitPerPage = 24;
  this.pagination = new Meteor.Pagination(Photos, {
    perPage: this.limitPerPage,
    page: FlowRouter.getQueryParam('page') || 1,
    filters: {
      albumId: FlowRouter.getParam('_id'),
      key: { $regex: '.*jpg' },
    },
    sort: {
      'metadata.DateTimeOriginal': 1,
    },
  });
  this.state = new ReactiveDict();
  const templateInstance = this;
  $(document).on('cbox_complete', function() {
    if ($('#colorbox').width() < 350) {
      $('#cboxLoadedContent').css('background-color', 'black');
      $.colorbox.resize({ width: 350 });
    }
    $('.cboxPhoto').off('click');
    $('#cboxNext').off('click');
    $('#cboxPrevious').off('click');
    $('#cboxNext').bind('click', function() {
      templateInstance.state.set('currentPhotoIndex', templateInstance.state.get('currentPhotoIndex') + 1);
      templateInstance.state.set('currentPhoto', templateInstance.pagination.getPage()[templateInstance.state.get('currentPhotoIndex')]);
      $.colorbox.next();
    });

    $('#cboxPrevious').bind('click', function() {
      templateInstance.state.set('currentPhotoIndex', templateInstance.state.get('currentPhotoIndex') - 1);
      templateInstance.state.set('currentPhoto', templateInstance.pagination.getPage()[templateInstance.state.get('currentPhotoIndex')]);
      $.colorbox.prev();
    });
    const myTemplate = document.createElement('div');
    myTemplate.innerHTML = Blaze.toHTMLWithData(Template.photoInfo, templateInstance.state.get('currentPhoto'));
    tippy('#cboxInfo', {
      html: myTemplate,
      placement: 'right',
      trigger: 'mouseenter',
      theme: 's3gallery',
    });
  });
});

Template.photoList.events({
  'click .jg-entry'(event, templateInstance) {
    templateInstance.state.set('currentPhotoIndex', this.photoIndex);
    templateInstance.state.set('currentPhoto', templateInstance.pagination.getPage()[this.photoIndex]);
  },
});

Template.photoList.helpers({
  isReady () {
    return Template.instance().pagination.ready();
  },
  templatePagination() {
    return Template.instance().pagination;
  },
  photos() {
    return Template.instance().pagination.getPage();
  },
});

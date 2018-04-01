import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Albums } from '../../api/albums.js';

import './albumListItem.js';
import '../paginator/paginator.js';

import './albumList.html';

Template.albumList.onCreated(function bodyOnCreated() {
  this.pagination = new Meteor.Pagination(Albums, {
    perPage: 12,
    page: FlowRouter.getQueryParam('page') || 1,
    sort: {
      firstPhotoDate: -1,
    },
  });
  this.state = new ReactiveDict();
  this.state.set('currentSort', 'DateD');
});

Template.albumList.events({
  'click .sort-date-a'(event) {
    event.preventDefault();
    Template.instance().state.set('currentSort', 'DateA');
    Template.instance().pagination.sort({
      firstPhotoDate: 1,
    });
  },
  'click .sort-date-d'(event) {
    event.preventDefault();
    Template.instance().state.set('currentSort', 'DateD');
    $('.dropdown-item.active').removeClass('active');
    $(event.target).addClass('active');
    Template.instance().pagination.sort({
      firstPhotoDate: -1,
    });
  },
  'click .sort-az-a'(event) {
    event.preventDefault();
    Template.instance().state.set('currentSort', 'AzA');
    $('.dropdown-item.active').removeClass('active');
    $(event.target).addClass('active');
    Template.instance().pagination.sort({
      name: 1,
    });
  },
  'click .sort-az-d'(event) {
    event.preventDefault();
    Template.instance().state.set('currentSort', 'AzD');
    $('.dropdown-item.active').removeClass('active');
    $(event.target).addClass('active');
    Template.instance().pagination.sort({
      name: -1,
    });
  },
});

Template.albumList.helpers({
  isReady () {
    return Template.instance().pagination.ready();
  },
  templatePagination() {
    return Template.instance().pagination;
  },
  albums() {
    return Template.instance().pagination.getPage();
  },
  isSortDateA() {
    return Template.instance().state.get('currentSort') === 'DateA';
  },
  isSortDateD() {
    return Template.instance().state.get('currentSort') === 'DateD';
  },
  isSortAzA() {
    return Template.instance().state.get('currentSort') === 'AzA';
  },
  isSortAzD() {
    return Template.instance().state.get('currentSort') === 'AzD';
  },
});

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Albums } from '../../api/albums.js';

import './albumListItem.js';
import '../paginator/paginator.js';

import './albumList.html';

Template.albumList.onCreated(function bodyOnCreated() {
  this.pagination = new Meteor.Pagination(Albums, {
    perPage: 12,
    page: FlowRouter.getQueryParam("page") || 1,
  });
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
});

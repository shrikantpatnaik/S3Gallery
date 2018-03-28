import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Albums } from '../../api/albums.js';

import '../photoList/photoList.js';
import './album.html';

Template.album.onCreated(function bodyOnCreated() {
  Meteor.subscribe('albums');
});

Template.album.helpers({
  album() {
    return Albums.findOne(FlowRouter.getParam('_id'));
  },
});

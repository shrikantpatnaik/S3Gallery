import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import _ from 'lodash';

import './header.html';


Template.header.events({
  'submit .loginForm'(event) {
    event.preventDefault();
    Meteor.loginWithPassword(event.target.loginEmail.value, event.target.loginPassword.value);
  },
  'click .logout'(event) {
    event.preventDefault();
    Meteor.logout();
  },
});

Template.header.helpers({
  isAdmin() {
    return FlowRouter.getQueryParam('admin') === 'true';
  },
  isHome() {
    const currentPath = FlowRouter.current().path;
    return currentPath === '/' || _.includes(currentPath, 'album');
  },
  isAbout() {
    return _.includes(FlowRouter.current().path, 'about');
  },
});

import './header.html'
import _ from 'lodash'

Template.header.events({
  'click .aws-update'(event) {
    event.preventDefault();
    Meteor.call('aws.update');
  },
  'submit .loginForm'(event) {
    event.preventDefault();
    Meteor.loginWithPassword(event.target.loginEmail.value, event.target.loginPassword.value);
  },
  'click .logout'() {
    event.preventDefault();
    Meteor.logout();
  },
});

Template.header.helpers({
  isAdmin() {
    return FlowRouter.getQueryParam("admin") == "true";
  },
  isHome() {
    var currentPath = FlowRouter.current().path;
    return currentPath == '/' || _.includes(currentPath, 'album');
  },
  isAbout() {
    return _.includes(FlowRouter.current().path, 'about');
  },
})

import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../ui/mainLayout/mainLayout.js'
import '../ui/albumList/albumList.js'
import '../ui/album/album.js'
import '../ui/header/header.js'
import '../ui/about/about.js'
import '../ui/changePassword/changePassword.js'

FlowRouter.route('/', {
  action: function(params, queryParams) {
    BlazeLayout.render('mainLayout', { top: 'header', main: 'albumList' });
  }
})

FlowRouter.route('/albums/:_id', {
  action: function(params, queryParams) {
    BlazeLayout.render('mainLayout', { top: 'header', main: 'album' });
  }
})

FlowRouter.route('/about', {
  action: function(params, queryParams) {
    BlazeLayout.render('mainLayout', { top: 'header', main: 'about' });
  }
})

FlowRouter.route('/changePassword', {
  action: function(params, queryParams) {
    BlazeLayout.render('mainLayout', { top: 'header', main: 'changePassword' });
  }
})

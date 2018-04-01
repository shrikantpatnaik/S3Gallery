import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../ui/mainLayout/mainLayout.js';
import '../ui/albumList/albumList.js';
import '../ui/album/album.js';
import '../ui/header/header.js';
import '../ui/about/about.js';
import '../ui/admin/admin.js';
import '../ui/changePassword/changePassword.js';

FlowRouter.route('/', {
  action() {
    BlazeLayout.render('mainLayout', { top: 'header', main: 'albumList' });
  },
});

FlowRouter.route('/albums/:_id', {
  action() {
    BlazeLayout.render('mainLayout', { top: 'header', main: 'album' });
  },
});

FlowRouter.route('/about', {
  action() {
    BlazeLayout.render('mainLayout', { top: 'header', main: 'about' });
  },
});

FlowRouter.route('/changePassword', {
  action() {
    BlazeLayout.render('mainLayout', { top: 'header', main: 'changePassword' });
  },
});

FlowRouter.route('/admin', {
  action() {
    BlazeLayout.render('mainLayout', { top: 'header', main: 'admin' });
  },
});

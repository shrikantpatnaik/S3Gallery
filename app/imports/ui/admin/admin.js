import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import swal from 'sweetalert2';

import './admin.html';

Template.admin.events({
  'click .logout'(event) {
    event.preventDefault();
    Meteor.logout();
  },
  'click .aws-update'(event) {
    event.preventDefault();
    swal({
      title: 'Updating from AWS',
      onOpen: () => {
        swal.showLoading();
      },
    });
    Meteor.call('aws.update', function(error) {
      swal.close();
      if (error) {
        swal({
          title: error.reason,
          text: error.message,
          type: 'error',
        });
      } else {
        swal({
          text: 'AWS Update Complete',
          type: 'success',
        });
      }
    });
  },
  'click .resetPhotos'(event) {
    event.preventDefault();
    swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.value) {
        Meteor.call('photos.reset', function(error) {
          if (error) {
            swal({
              title: error.reason,
              text: error.message,
              type: 'error',
            });
          } else {
            swal(
              'Deleted!',
              'All photos have been deleted from the local database',
              'success',
            );
          }
        });
      }
    });
  },
  'click .resetAlbums'(event) {
    event.preventDefault();
    swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.value) {
        Meteor.call('albums.reset', function(error) {
          if (error) {
            swal({
              title: error.reason,
              text: error.message,
              type: 'error',
            });
          } else {
            swal(
              'Deleted!',
              'All albums have been deleted from the local database',
              'success',
            );
          }
        });
      }
    });
  },
});

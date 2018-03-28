import { Template } from 'meteor/templating';
import { Accounts } from 'meteor/accounts-base';

import swal from 'sweetalert2';


import './changePassword.html';
import './changePassword.css';

Template.changePassword.events({
  'submit .changePasswordForm'(event) {
    event.preventDefault();
    Accounts.changePassword(
      event.target.oldPassword.value,
      event.target.newPassword.value,
      function(err) {
        if (err) {
          swal({
            title: err.reason,
            text: err.message,
            type: 'error',
          });
        } else {
          swal({
            text: 'Password Changed Successfully',
            type: 'success',
          });
        }
      },
    );
  },
});

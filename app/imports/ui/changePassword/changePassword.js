import './changePassword.html'
import './changePassword.css'

Template.changePassword.events({
  'submit .changePasswordForm'(e) {
    e.preventDefault();
    Accounts.changePassword(e.target.oldPassword.value, e.target.newPassword.value, function(err) {
      if(err) {
        swal({
          title: err.reason,
          text: err.message,
          type: 'error'
        })
      } else {
        swal({
          text: "Password Changed Successfully",
          type: 'success'
        })
      }
    });
  }
})

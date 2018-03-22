import { Accounts } from 'meteor/accounts-base';

if(Meteor.isServer) {
  Accounts.config({
    forbidClientAccountCreation: true
  });

  if ( Meteor.users.find().count() === 0 ) {
      Accounts.createUser({
          username: 'admin',
          password: 'password',
      });
  }
}

import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
  Accounts.config({
    forbidClientAccountCreation: true,
  });

  if (Meteor.users.find().count() === 0) {
    Accounts.createUser({
      username: 'admin',
      password: 'password',
    });
  }
}

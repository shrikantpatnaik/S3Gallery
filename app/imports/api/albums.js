import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { publishPagination } from 'meteor/kurounin:pagination';

export const Albums = new Mongo.Collection('albums');
export default Albums;

if (Meteor.isServer) {
  publishPagination(Albums);
}

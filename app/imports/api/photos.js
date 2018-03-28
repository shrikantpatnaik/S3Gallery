import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { publishPagination } from 'meteor/kurounin:pagination';


export const Photos = new Mongo.Collection('photos');
export default Photos;

if (Meteor.isServer) {
  publishPagination(Photos);
}

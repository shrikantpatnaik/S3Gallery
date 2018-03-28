import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './albumListItem.html';

import './albumListItem.css';

Template.albumListItem.helpers({
  featuredImageUrl() {
    return `//${Meteor.settings.public.photosBaseUrl}/${encodeURI(this.featuredImageKey)}`;
  },
});

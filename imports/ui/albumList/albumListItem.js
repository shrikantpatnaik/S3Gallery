import { Template } from 'meteor/templating';

import './albumListItem.html';

import './albumListItem.css';

Template.albumListItem.helpers({
  featuredImageUrl() {
    return "//images.shrikantpatnaik.photography/"+encodeURI(this.featuredImageKey);
  }
});

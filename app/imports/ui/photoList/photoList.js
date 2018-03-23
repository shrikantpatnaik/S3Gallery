import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Photos } from '../../api/photos.js';

import _ from 'lodash'

import './photoListItem.js';
import '../paginator/paginator.js';
import './photoInfo.js';

import './photoList.html';

import './photoList.css'

Template.photoList.onCreated(function bodyOnCreated() {
  this.limitPerPage = 12;
  this.pagination = new Meteor.Pagination(Photos, {
    perPage: this.limitPerPage,
    page: FlowRouter.getQueryParam("page") || 1,
    filters: {
      albumId: FlowRouter.getParam('_id'),
    },
  });
  this.state = new ReactiveDict();
  this.state.set("HighQ", false)
  this.modalIsOpen = false;
  const templateInstance = this;

  Meteor.startup(function () {
    $(document).on('keyup', function (e) {
      if(templateInstance.modalIsOpen) {
        if(e.keyCode == 39) {
          nextImage(templateInstance);
        } else if (e.keyCode == 37) {
          prevImage(templateInstance);
        }
      }
    });
  });
});

function nextImage(tInstance) {
  if(tInstance.state.get("currentPhotoIndex") < tInstance.pagination.getPage().length - 1) {
    tInstance.state.set("currentPhotoIndex", tInstance.state.get("currentPhotoIndex") + 1);
  } else if(tInstance.state.get("currentPhotoIndex") == tInstance.pagination.getPage().length - 1 && tInstance.pagination.currentPage() != tInstance.pagination.totalPages()) {
    tInstance.pagination.currentPage(tInstance.pagination.currentPage() + 1)
    tInstance.state.set("currentPhotoIndex", 0)
  }
}

function prevImage(tInstance) {
  if(tInstance.state.get("currentPhotoIndex") > 0) {
    tInstance.state.set("currentPhotoIndex", tInstance.state.get("currentPhotoIndex") - 1);
  } else if(tInstance.state.get("currentPhotoIndex") == 0 && tInstance.pagination.currentPage()!=1) {
    tInstance.pagination.currentPage(tInstance.pagination.currentPage() - 1)
    tInstance.state.set("currentPhotoIndex", tInstance.limitPerPage - 1)
  }
}

Template.photoList.events({
  'click .galleryItem'() {
    Template.instance().state.set('currentPhotoIndex', this.index)
    document.getElementById('myModal').style.display = "block";
    Template.instance().modalIsOpen = true;
    document.getElementById('loadingDiv').style.display = "block"
  },
  'click #myModal'(e) {
    var list = [
      "modal-content", "loading", "mySlides", "modalVideo",
      "modalImage", "prev", "next", "caption-container", "caption"
    ];
    e.preventDefault();
    if(!_.includes(list, e.target.className)) {
      Template.instance().state.delete("currentPhotoIndex")
      document.getElementById('loadingDiv').style.display = "none"
      Template.instance().modalIsOpen = false;
      document.getElementById('myModal').style.display = "none";
    }
  },
  'click .prev'() {
    document.getElementById('loadingDiv').style.display = "block"
    prevImage(Template.instance())
  },
  'click .next'() {
    document.getElementById('loadingDiv').style.display = "block"
    nextImage(Template.instance());
  },
  'click .quality'() {
    document.getElementById('loadingDiv').style.display = "block"
    Template.instance().state.set("HighQ", !Template.instance().state.get("HighQ"))
  },
  'load .modalImage'() {
    document.getElementById('loadingDiv').style.display = "none";
  },
  'loadeddata	 .modalVideo'() {
    document.getElementById('loadingDiv').style.display = "none";
  },
})

function getCurrentPhotoIndex() {
  return Template.instance().state.get("currentPhotoIndex");
}

Template.photoList.helpers({
  isReady () {
    return Template.instance().pagination.ready();
  },
  templatePagination() {
    return Template.instance().pagination;
  },
  photos() {
    return Template.instance().pagination.getPage();
  },
  getSelectedPhotoURL() {
    // +"?dummy="+Date.now()
    var index = getCurrentPhotoIndex();
    if(index!=undefined) {
      var url = "//" + Meteor.settings.public.photosBaseUrl + "/" + encodeURI(Template.instance().pagination.getPage()[index].key);
      if(Template.instance().state.get("HighQ")) {
        return _.replace(url, Meteor.settings.public.s3LowQualityFolderName, Meteor.settings.public.s3HighQualityFolderName);
      }
      return url;
    }
    return "";
  },
  isVideo() {
    var index = getCurrentPhotoIndex();
    if(index!=undefined) {
      return _.endsWith(Template.instance().pagination.getPage()[index].key, '.mp4')
    }
    return false;
  },
  isHighQ() {
    return Template.instance().state.get("HighQ")
  },
  isFirstItem() {
    return getCurrentPhotoIndex() == 0 && Template.instance().pagination.currentPage() == 1 ;
  },
  isLastItem() {
    return ((getCurrentPhotoIndex() == Template.instance().pagination.getPage().length - 1) && (Template.instance().pagination.currentPage() == Template.instance().pagination.totalPages()));
  },
  getSelectedPhoto() {
    var index = getCurrentPhotoIndex();
    if(index!=undefined) {
      return Template.instance().pagination.getPage()[index];
    } else {
      return "";
    }
  },
});

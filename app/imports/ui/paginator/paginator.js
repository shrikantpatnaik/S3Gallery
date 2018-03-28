import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter } from 'meteor/kadira:flow-router';

import './paginator.html';

import './paginator.css';

const getIntArray = function(min, max) {
  const result = [];
  for (let i = min; i < max; ++i) {
    result.push(i);
  }
  return result;
};

Template.paginator.onCreated(function() {
  const self = this;

  if (!this.data.pagination) {
    return;
  }

  this.displayedPages = new ReactiveVar([]);

  // auto slice displayedPages to fit in one line
  this.autorun(function() {
    if (!self.data.pagination.ready()) {
      return;
    }

    const pageCount = self.data.pagination.totalPages();
    const current = self.data.pagination.currentPage();
    let displayedPages;

    if (pageCount > self.data.limit) {
      let min = 0;
      if (current > self.data.limit / 2) {
        if (current > pageCount - (self.data.limit / 2)) {
          min = pageCount - self.data.limit;
        } else {
          min = Math.floor(current - (self.data.limit / 2));
        }
      }
      displayedPages = getIntArray(min + 1, min + 1 + self.data.limit);
    } else {
      displayedPages = getIntArray(1, pageCount + 1);
    }

    self.displayedPages.set(displayedPages);
  });
});

Template.paginator.helpers({
  hasPages () {
    return this.pagination && this.pagination.totalPages() > 1 && this.limit;
  },
  isActive() {
    return this.valueOf() === Template.instance().data.pagination.currentPage();
  },
  pagesToDisplay() {
    return Template.instance().displayedPages.get();
  },
  isInFirstPage() {
    return this.pagination.currentPage() === 1;
  },
  arePreviousPagesHidden() {
    const displayedPages = Template.instance().displayedPages.get();
    return displayedPages && displayedPages.length && displayedPages[0] > 1;
  },
  areNextPagesHidden() {
    const displayedPages = Template.instance().displayedPages.get();
    return displayedPages
      && (displayedPages[displayedPages.length - 1] < this.pagination.totalPages());
  },
  isInLastPage() {
    return this.pagination.currentPage() === this.pagination.totalPages();
  },
  lastPage() {
    return this.pagination.totalPages();
  },
});

Template.paginator.events({
  'click .page-sel'(event, templateInstance) {
    event.preventDefault();
    FlowRouter.setQueryParams({ page: this.valueOf() });
    templateInstance.data.pagination.currentPage(this.valueOf());
  },
  'click .previous-page'(event, templateInstance) {
    event.preventDefault();
    FlowRouter.setQueryParams({ page: templateInstance.data.pagination.currentPage() - 1 });
    templateInstance.data.pagination
      .currentPage(templateInstance.data.pagination.currentPage() - 1);
  },
  'click .next-page'(event, templateInstance) {
    event.preventDefault();
    FlowRouter.setQueryParams({ page: templateInstance.data.pagination.currentPage() + 1 });
    templateInstance.data.pagination
      .currentPage(templateInstance.data.pagination.currentPage() + 1);
  },
  'click .show-prev'(event, templateInstance) {
    event.preventDefault();
    const displayedPages = templateInstance.displayedPages.get();
    const min = Math.max(1, displayedPages[0] - templateInstance.data.limit);
    templateInstance.displayedPages.set(getIntArray(min, min + templateInstance.data.limit));
  },
  'click .show-next'(event, templateInstance) {
    event.preventDefault();
    const pageCount = templateInstance.data.pagination.totalPages();
    const displayedPages = templateInstance.displayedPages.get();
    const min = Math.min(
      pageCount - templateInstance.data.limit,
      displayedPages[displayedPages.length - 1],
    ) + 1;
    templateInstance.displayedPages.set(getIntArray(min, min + templateInstance.data.limit));
  },
});

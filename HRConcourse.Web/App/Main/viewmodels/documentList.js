define(['plugins/http', 'plugins/router', 'durandal/app', 'knockout'], function (http, router, app, ko) {
  var documentListVM = function () {
    var self = this;
    var initializing = true;

    self.documents = ko.observableArray([]);
    self.showPublished = ko.observable(false);
    self.searchString = ko.observable('');

    // Get documents
    self.getDocuments = function () {
      abp.ui.setBusy();
      return abp.services.hrconcourse.documents.getDocuments({ OnlyWithWorkingRevision: self.showPublished(), SearchString: self.searchString() }).then(function (response) {
        self.documents(response.documents);
        abp.ui.clearBusy();
      });
    }

    // Add new document
    self.addDocument = function () {
      router.navigate('addDocument');
    };
    
    // Design document url
    self.designUrl = function (document) {
      return '#designDocument/' + document.documentId;
    }

    // Edit document url
    self.editUrl = function (document) {
      return '#editDocument/' + document.documentId;
    }

    // Document entries url
    self.entriesUrl = function (document) {
      return '#documentEntries/' + document.documentId;
    }

    
    // Automatic search
    var search = ko.computed(function () {
      var onlyPublished = self.showPublished();
      var searchString = self.searchString();
      if (!initializing) {
        self.getDocuments();
      }
    });

    // Remove Document
    self.removeDocument = function (document) {
      app.showMessage('Are you sure you want to delete this document', 'Delete document', [{ text: 'Delete', value: true }, { text: 'Cancel', value: false }])
        .then(function (result) {
          if (result) {
            return abp.services.hrconcourse.documents.deleteDocument({ documentId: document.documentId }).then(function (response) {
              self.getDocuments();
            });
          }
        });
    };

    self.activate = function (caseId) {
      //the router's activator calls this function and waits for it to complete before proceeding
      if (self.documents().length > 0) { return; }
      return self.getDocuments();
    };

    self.compositionComplete = function () {
      // Initialize tooltips
      $('[data-toggle="tooltip"]').tooltip();

      // Mark the initialization as completed
      initializing = false;
    };
  };
  return documentListVM;
});
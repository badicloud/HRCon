define(['plugins/http', 'plugins/router', 'durandal/app', 'knockout'], function (http, router, app, ko) {
  var editDocumentVM = function () {
    var self = this;
    
    self.documentId = ko.observable();
    self.documentData = {
      name: ko.observable().extend({ required: true }),
      readOnly: ko.observable(false),
      hardSignature: ko.observable(false)
    };
    self.documentData.errors = ko.validation.group(self.documentData);

    self.save = function () {
      if (self.documentData.errors().length !== 0) {
        self.documentData.errors.showAllMessages();
      } else {
        abp.ui.setBusy();
        // Save document changes
        abp.services.hrconcourse.documents.updateDocument({
          Id: self.documentId(),
          Name: self.documentData.name(),
          IsReadOnly: self.documentData.readOnly(),
          RequiresHardSignature: self.documentData.hardSignature()
        }).then(function (response) {
          abp.ui.clearBusy();
          router.navigate('#documents');
        });
      }
    };

    self.activate = function (documentId) {
      // Save the document Id
      self.documentId(documentId);
      // Get the document info
      abp.ui.setBusy();
      // Get the document info
      return abp.services.hrconcourse.documents.getDocumentInfo({ DocumentId: self.documentId() }).then(function (response) {
        // Save the document info
        self.documentData.name(response.name);
        self.documentData.readOnly(response.isReadOnly);
        self.documentData.hardSignature(response.requiresHardSignature);
        abp.ui.clearBusy();
      });
    };
  };
  return editDocumentVM;
});

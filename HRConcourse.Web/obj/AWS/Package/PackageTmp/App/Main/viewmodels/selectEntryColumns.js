define(['plugins/http', 'plugins/router', 'durandal/app', 'knockout'], function (http, router, app, ko) {
  var selectEntryColumnsVM = function () {
    var self = this;

    self.documentId = ko.observable();
    self.documentName = ko.observable();
    self.fieldNames = ko.observableArray([]);
    self.entryDisplayFieldNames = ko.observableArray([]);

    self.save = function () {
      abp.ui.setBusy();
      var names = [];
      $.each(self.fieldNames(), function (index, field) {
        if (field.selected()) {
          names.push(field.name);
        }
      });
      // Save the selection
      return abp.services.hrconcourse.documents.setEntryDisplayFieldNames({ DocumentId: self.documentId(), FieldNames: names }).then(function (response) {
        abp.ui.clearBusy();
        router.navigate('#documentEntries/' + self.documentId());
      });
    }

    self.activate = function (documentId) {
      // Save the document Id
      self.documentId(documentId);

      abp.ui.setBusy();

      // Get Document info
      abp.services.hrconcourse.documents.getDocumentInfo({ DocumentId: self.documentId() }).then(function (response) {
        self.documentName(response.name);
      });
      
      // Get entry display field names
      return abp.services.hrconcourse.documents.getEntryDisplayFieldNames({ DocumentId: self.documentId() }).then(function (response) {
        // Save entry display field names
        $.each(response.fieldNames, function (index, field) {
          self.entryDisplayFieldNames.push(field.name);
        });

        // Get field names
        abp.services.hrconcourse.documents.getFieldNames({ DocumentId: self.documentId() }).then(function (response) {
          // Save the field names
          $.each(response.fieldNames, function (index, field) {
            self.fieldNames.push({
              name: field.name,
              selected: ko.observable(self.entryDisplayFieldNames.indexOf(field.name) != -1)
            });
          });

          abp.ui.clearBusy();
        });
      });
    };
  };
  return selectEntryColumnsVM;
});

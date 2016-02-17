define(['plugins/http', 'plugins/router', 'durandal/app', 'knockout'], function (http, router, app, ko) {
  var documentEntriesVM = function () {
    var self = this;

    self.documentId = ko.observable();
    self.documentName = ko.observable();
    self.fieldNames = ko.observableArray([]);
    self.entryValues = ko.observableArray([]);

    self.columnValue = function (entryValue, fieldName) {
      for (var i = 0; i < entryValue.length; i++) {
        if (entryValue[i].name === fieldName)
          return entryValue[i].value; // Return as soon as the object is found
      }
    }

    self.selectColumns = function () {
      router.navigate('#selectEntryColumns/' + self.documentId());
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
        // Save the field names
        self.fieldNames(response.fieldNames);
        if (self.fieldNames().length) {
          // Get entries with names
          var names = $.map(self.fieldNames(), function (field) { return field.name; });
          abp.services.hrconcourse.documents.getEntryWithNames({ DocumentId: self.documentId(), FieldNames: names }).then(function (response) {
            $.each(response.entryValues, function (index, entryValues) {
              self.entryValues.push(entryValues.fieldValues);
            });
            
            abp.ui.clearBusy();
          });
        } else {
          abp.ui.clearBusy();
        }
      });
    };
  };
  return documentEntriesVM;
});

define(['plugins/http', 'plugins/router', 'durandal/app', 'knockout'], function (http, router, app, ko) {
  var addDocumentVM = function () {
    var self = this;
    var pageImages;

    self.documentData = {
      name: ko.observable().extend({ required: true }),
      readOnly: ko.observable(false),
      hardSignature: ko.observable(false),
      createdFrom: ko.observable("blank").extend({ required: true }),
      file: ko.observable()
    };
    self.documentData.errors = ko.validation.group(self.documentData);

    self.uploadProgress = ko.observable(0);
    
    self.uploadOptions = {
      url: "PdfToImage",
      dataType: 'json',
      progress: function (e, data) {
        self.uploadProgress(parseInt(data.loaded / data.total * 100, 10));
      }
    };

      self.selectedFileName = function() {
          $("#no-file-found").hide();
          if (self.documentData.file() && self.documentData.file().files[0]) {
              return self.documentData.file().files[0].name;
          }
      };

    self.addDocument = function () {
      if (self.documentData.errors().length !== 0) {
        self.documentData.errors.showAllMessages();
      } else {
        //abp.ui.setBusy();
        if (self.documentData.createdFrom() === "pdf") {
            if (self.documentData.file()) {
                $("#no-file-found").hide();
                // Parse document images
                var result = self.documentData.file().submit().then(function (data) {
                    pageImages = [];
                    data.result.forEach(function (image) {
                        pageImages.push({ PageNumber: image.pageNumber, ImageId: image.imageId });
                    });
                    // Create document from pdf
                    abp.services.hrconcourse.documents.createDocumentWithImages({
                        Name: self.documentData.name(),
                        IsReadOnly: self.documentData.readOnly(),
                        RequiresHardSignature: self.documentData.hardSignature(),
                        PageImages: pageImages
                    }).then(function (response) {
                        abp.ui.clearBusy();
                        router.navigate('designDocument/' + response.documentId);
                    });
                });
            } else {
                $("#no-file-found").show();
            }
        } else {
          // Create blank document
          abp.services.hrconcourse.documents.createDocument({
            Name: self.documentData.name(),
            IsReadOnly: self.documentData.readOnly(),
            RequiresHardSignature: self.documentData.hardSignature()
          }).then(function (response) {
            abp.ui.clearBusy();
            router.navigate('designDocument/' + response.documentId);
          });
        }
      }
    };

    self.compositionComplete = function () {
      // Initialize tooltips
      $('[data-toggle="tooltip"]').tooltip();

    };
  };
  return addDocumentVM;
});
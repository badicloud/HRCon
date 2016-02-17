define(['plugins/http', 'durandal/app', 'knockout'], function (http, app, ko) {

    /** Web Resolution Detector **/
    (function () {
        var documentScreenSize = function () {
            var screenWidth = screen.width;
            var screenHeight = screen.height;

            var dialogOpts = {
                modal: true,
                closeOnEscape: false,
                autoOpen: false
            }

            if (screenWidth < 1024 || screenHeight < 768) {
                $(".dialog-text").text("Application is not working below 1024 x 768 screen resolution. Please reload the page");
                $("#screenDialog").dialog(dialogOpts);
                $("#screenDialog").dialog("open");
            }
        };

        $(window).resize(function () {
            documentScreenSize();
        });

        
    })();

    /** eof Web Resolution Detector **/
    var designDocumentVM = function () {
        var self = this;
        self.documentId = ko.observable();
        self.documentInfo = ko.observable({ name: '', pages: [] });
        self.currentPage = ko.observable(0);
        self.fieldsMetadata = ko.observable();
        self.designerUrl = ko.observable('');
        self.imageId = ko.observable();

        // Set Page
        self.setPage = function (index) {
            if (self.documentInfo().pages && self.documentInfo().pages[index] && self.documentInfo().pages[index].fields) {
                self.fieldsMetadata(self.documentInfo().pages[index].fields);
                self.imageId(self.documentInfo().pages[index].imageId);
                self.currentPage(index + 1);
                self.refresh();
            }
        };

        // Is Page Active
        self.isPageActive = function (page) {
            return self.currentPage() == page.number;
        };
        // Publish Draft 
        self.publishDraft = function () {
            abp.services.hrconcourse.documents.publishDraft({ DocumentId: self.documentId() }).then(function () {
                updateCurrentDocument();
            });
        }
        // Load Page
        self.loadPage = function (page) {
          if (self.currentPage() != page.number) {
            // Locally save changes
            var index = self.currentPage() - 1;
            if (self.documentInfo().pages && self.documentInfo().pages[index] && self.documentInfo().pages[index].fields) {
              self.documentInfo().pages[index].fields = document.getElementById('myIFrame').contentWindow.getFieldsMetadata();
            }

            self.setPage(page.number - 1);
          }
        };

        // Add Page
        self.addPage = function () {
          abp.ui.setBusy();
          abp.services.hrconcourse.documents.addPage({ DocumentId: self.documentId() }).then(function () {
            // Locally save changes of the current page
            var index = self.currentPage() - 1;
            if (self.documentInfo().pages && self.documentInfo().pages[index] && self.documentInfo().pages[index].fields) {
              self.documentInfo().pages[index].fields = document.getElementById('myIFrame').contentWindow.getFieldsMetadata();
            }

            updateCurrentDocument().then(function () {
              self.setPage(self.documentInfo().pages.length - 1);
              abp.ui.clearBusy();
            });
          });
        };
        // Remove Page
        self.removePage = function () {
            app.showMessage('Are you sure you want to delete this page', 'Delete Page', [{ text: 'Delete', value: true }, { text: 'Cancel', value: false }])
             .then(function (result) {
                 abp.ui.setBusy();
                 abp.services.hrconcourse.documents.deletePage({ DocumentId: self.documentId(), pageId: self.documentInfo().pages[self.currentPage()-1].pageId }).then(function () {
                     abp.ui.clearBusy();
                     updateCurrentDocument().then(function(){   self.refresh();});

                 });
             });
        };
        // Save Changes
        self.saveChanges = function () {
            abp.ui.setBusy();
            saveChanges().then(function () { abp.ui.clearBusy(); });
        };

        // Refresh
        self.refresh = function () {
            document.getElementById('myIFrame').contentWindow.setFieldsMetadata(self.fieldsMetadata());
            if (self.imageId()) {
                document.getElementById('myIFrame').contentWindow.setFormImage("/image?pageImageId=" + self.imageId());
            } else {
                document.getElementById('myIFrame').contentWindow.resetImage();
            }
        };

        // Clear Form
        self.clearForm = function () {
            document.getElementById('myIFrame').contentWindow.clearForm();
        };


        // Update current document instance
        function updateCurrentDocument() {
            abp.ui.setBusy();
            // Get the document info
            return abp.services.hrconcourse.documents.getDocumentDesign({ DocumentId: self.documentId() }).then(function (response) {
                // Save the document info
                self.documentInfo(response);
                abp.ui.clearBusy();
            });
        }
        // Save changes of the document
        function saveChanges() {
          // Locally save changes
          var index = self.currentPage() - 1;
          if (self.documentInfo().pages && self.documentInfo().pages[index] && self.documentInfo().pages[index].fields) {
            self.documentInfo().pages[index].fields = document.getElementById('myIFrame').contentWindow.getFieldsMetadata();
          }

          // Get all pages fields
          var pagesDesign = [];
          self.documentInfo().pages.forEach(function (page) {
            pagesDesign.push({ PageNumber: page.number, Fields: page.fields });
          });

          return abp.services.hrconcourse.documents.saveDocumentDesign({
              DocumentId: self.documentId(),
              PagesDesign: pagesDesign
          }).then(function () { updateCurrentDocument(); });
        }


        self.activate = function (documentId) {
            // Save the document Id
            self.documentId(documentId);
            // Get the document info
            updateCurrentDocument();
        };
        self.compositionComplete = function () {
            abp.ui.setBusy();

            // Initialize tooltips
            $('[data-toggle="tooltip"]').tooltip();

            // Set designer url
            self.designerUrl('/FormBuilder');
            // Set the fields when the designer is ready
            $('#myIFrame').load(function () {
                self.setPage(0);
                abp.ui.clearBusy();
            });
        };
    };

    return designDocumentVM;
});
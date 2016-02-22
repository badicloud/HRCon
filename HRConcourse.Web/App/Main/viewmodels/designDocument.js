define(['plugins/http', 'durandal/app', 'knockout', 'plugins/router'], function (http, app, ko, router) {

    var designDocumentVM = function () {
        var self = this;
        self.documentId = ko.observable();
        self.documentInfo = ko.observable({ name: '', pages: [] });
        self.currentPage = ko.observable(0);
        self.fieldsMetadata = ko.observable();
        self.designerUrl = ko.observable('');
        self.imageId = ko.observable();
        self.width = ko.observable();
        self.height = ko.observable();
        self.hasValidScreen = ko.observable(true);
        self.imageDocuments = ko.observableArray();
        self.documentData = {
            file: ko.observable()
        };

        self.uploadProgress = ko.observable(0);

        self.uploadPdfOptions = {
            url: "UploadPdfToImage",
            dataType: 'json',
            progress: function (e, data) {
                self.uploadProgress(parseInt(data.loaded / data.total * 100, 10));
            }
        };

        self.selectedFileName = function () {
            if (self.documentData.file() && self.documentData.file().files[0])
                return self.documentData.file().files[0].name;
        };

        // Set Page
        self.setPage = function (index) {
            if (self.documentInfo().pages && self.documentInfo().pages[index] && self.documentInfo().pages[index].fields) {
                self.fieldsMetadata(self.documentInfo().pages[index].fields);
                self.imageId(self.documentInfo().pages[index].imageId);
                self.currentPage(index + 1);
                self.refresh();

                var imgCount = $('#myIFrame').contents().find("#form-builder #form-image:has(img)").length;
                if (imgCount > 0) {
                    $("#edit-image-document").show();
                } else {
                    $("#edit-image-document").hide();
                }
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
            var index = self.currentPage() - 1;
           
            if (self.currentPage() !== page.number) {
                // Locally save changes
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
            var previousPage = self.currentPage() - 1;
            var index = previousPage - 1;
            app.showMessage('Are you sure you want to delete this page', 'Delete Page', [{ text: 'Delete', value: true }, { text: 'Cancel', value: false }])
             .then(function (result) {
                 abp.ui.setBusy();
                    abp.services.hrconcourse.documents.deletePage({ DocumentId: self.documentId(), pageId: self.documentInfo().pages[self.currentPage() - 1].pageId }).then(function() {
                        abp.ui.clearBusy();
                        updateCurrentDocument().then(function () {
                            self.currentPage(previousPage);
                            self.setPage(index);
                        });

                    });
                });
        };
        // Save Changes
        self.saveChanges = function () {
            abp.ui.setBusy();
            saveChanges().then(function () { abp.ui.clearBusy(); });
        };

        var setFormImageOnEvent = function (imageId) {
            document.getElementById('myIFrame').contentWindow.setFieldsMetadata(self.fieldsMetadata());
            if (imageId) {
                document.getElementById('myIFrame').contentWindow.setFormImage("/image?pageImageId=" + imageId);
            } else {
                document.getElementById('myIFrame').contentWindow.resetImage();
            }
        }

        // Refresh
        self.refresh = function () {
            setFormImageOnEvent(self.imageId());
        };

        //Update Current Page
        self.UpdateCurrentImage = function (item, event) {
            var selectedDocumentInfo = self.documentInfo().pages[self.currentPage() - 1];
            var imageId = item.imageId;

            if (imageId !== null) {
                abp.ui.setBusy();
                $(".modal").css({ 'z-index': '1040' });
                abp.services.hrconcourse.documents.updatePageImage({ DocumentId: self.documentId(), PageId: selectedDocumentInfo.pageId, ImageId: imageId }).then(function () {
                    abp.ui.clearBusy();
                    setFormImageOnEvent(item.imageId);
                    $("#document-modal").modal('hide');
                    $(".modal").css({ 'z-index': '1050' });
                });
            }

        }

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


        var documentScreenResized = function (screenWidth, screenHeight) {
            var dialogOpts = {
                modal: true,
                closeOnEscape: false,
                autoOpen: false,
                open: function (event, ui) {
                    $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
                },
                close: function () {
                    $("#screenDialog").hide();
                    $(".ui-dialog-title").removeClass("error-title");
                }
            }

            if (screenWidth < 1024 || screenHeight < 768) {
                $("#screenDialog").show();
                $(".dialog-text").text("Sorry, but this document can not be viewed on your device.  Please view it with a desktop computer.");
                $("#screenDialog").dialog(dialogOpts);
                $("#screenDialog").dialog("open");
                $(".ui-dialog-title").addClass("error-title");
                $("#screenDialog").dialog("option", "position", { my: "center", at: "center", of: window });
                self.hasValidScreen(false);
            } else {
                if ($(".ui-dialog").is(":visible")) {
                    $("#screenDialog").hide();
                    $(".ui-dialog-title").removeClass("error-title");
                    $("#screenDialog").dialog("close");
                    self.hasValidScreen(true);
                }
            }
        };

        self.activate = function (documentId) {

            // Save the document Id
            self.documentId(documentId);
            // Get the document info
            updateCurrentDocument();
            
        };

        router.on('router:navigation:composition-complete', () => {
            self.width(screen.width);
            self.height(screen.height);

            documentScreenResized(self.width(), self.height());
        });

        $(window).resize(function () {
            self.width(screen.width);
            self.height(screen.height);

            documentScreenResized(self.width(), self.height());
        });

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
                var imgCount = $('#myIFrame').contents().find("#form-builder #form-image:has(img)").length;

                if (imgCount > 0) {
                    $("#edit-image-document").show();
                } else {
                    $("#edit-image-document").hide();
                }
            });
        };

        self.updateDocumentPage = function() {
            $("#document-modal").modal('show');
        };

        self.uploadPdfDocument = function () {
            if (self.documentData.file()) {
                self.imageDocuments([]);

                abp.ui.setBusy();
                $(".modal").css({ 'z-index': '1040' });
                $(".no-file-found").hide();
                self.documentData.file().submit().then(function (data) {
                    data.result.forEach(function (data) {

                        var imagedata = "/image?pageImageId=" + data.imageId;
                        self.imageDocuments.push({ page: "Page "+ (data.index + 1), image: imagedata, imageId : data.imageId });
                    });

                    abp.ui.clearBusy();
                    $(".modal").css({ 'z-index': '1050' });
                });
            } else {
                $(".no-file-found").show();
            }
        };
    };

    return designDocumentVM;
});
// File Uploader binding
ko.bindingHandlers.fileUploader = {
  update: function (element, valueAccessor, allBindings) {
    var options = allBindings().uploadOptions || {};

    // Handle add event
    options.add = function (e, data) {
      valueAccessor()(data);
      console.log('done');
    };

    //initialize
    $(element).fileupload(options);
  }
};
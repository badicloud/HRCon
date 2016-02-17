// Date formating with moment.js
ko.bindingHandlers.simpleDate = {
  update: function (element, valueAccessor, allBindings) {
    var format = allBindings().format || 'MM/DD/YYYY';

    var value = ko.utils.unwrapObservable(valueAccessor());

    //handle date data coming via json from Microsoft
    if (String(value).indexOf('/Date(') == 0) {
      value = new Date(parseInt(value.replace(/\/Date\((.*?)\)\//gi, "$1")));
    }

    if (value != undefined) {
      var date = moment(value).format(format); // Use "unwrapObservable" so we can handle values that may or may not be observable
      $(element).html(date);
    }
  },
};
define(['plugins/http', 'knockout'], function (http, ko) {
  this.lastVisited = ko.observableArray([]);

  return {
    lastVisited: lastVisited,
    activate: function () {
      //the router's activator calls this function and waits for it to complete before proceeding
      if (this.lastVisited().length > 0) {
        return;
      }

      var that = this;
      return http.get('/api/Documents/LastVisited').then(function (response) {
        that.lastVisited(response);
      });
    },
  };
});
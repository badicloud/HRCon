define(['plugins/router', 'durandal/app'], function (router, app) {
  var loading = ko.observable(false);
  
  app.on('loading').then(function (value) { loading(!!value); });
    var userDisplayName = ko.observable('');
  return {
    router: router,
    isLoading: loading,
    userDisplayName: userDisplayName,
    search: function() {
      //It's really easy to show a message box.
      //You can add custom options too. Also, it returns a promise for the user's response.
      app.showMessage('Search not yet implemented...');
    },
    activate: function () {
      router.map([
        { route: '', title: 'Welcome', moduleId: 'viewmodels/documentList', nav: true },
        { route: 'documents', title: 'Documents', moduleId: 'viewmodels/documentList', nav: true },
        { route: 'addDocument', title: 'Add Document', moduleId: 'viewmodels/addDocument', nav: true },
        { route: 'designDocument/:id', title: 'Design Document', moduleId: 'viewmodels/designDocument', nav: true },
        { route: 'editDocument/:id', title: 'Edit Document', moduleId: 'viewmodels/editDocument', nav: true },
        { route: 'documentEntries/:id', title: 'Document Entries', moduleId: 'viewmodels/documentEntries', nav: true },
        { route: 'selectEntryColumns/:id', title: 'Select Entry Columns', moduleId: 'viewmodels/selectEntryColumns', nav: true },
        { route: 'apiKeys', title: 'API Keys', moduleId: 'viewmodels/apiCredentials', nav: true }
      ]).buildNavigationModel();

        abp.services.hrconcourse.session.getCurrentLoginInformations().done(function(result) {
            var name = result.user.name;
            var lastName = result.user.surname;

            userDisplayName(name + ' ' + lastName);
        });

      return router.activate();
    }
  };
});
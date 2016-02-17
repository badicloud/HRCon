define(['plugins/http', 'plugins/router', 'durandal/app', 'knockout'], function (http, router, app, ko) {
    var apiCredentialsVM = function () {
        var self = this;
        self.authenticationUrl = abp.appFullPath + "api/account/Authenticate/";
        self.apiKeys = ko.observable();
        self.activate = function() {
            abp.ui.setBusy();
            return abp.services.hrconcourse.users.getApiKeys({}).then(function (response) {
                self.apiKeys(response);
                abp.ui.clearBusy();
            });
        }

      
   
    };
    return apiCredentialsVM;
});
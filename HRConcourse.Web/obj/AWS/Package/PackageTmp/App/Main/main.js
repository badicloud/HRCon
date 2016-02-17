//Shortcuts
requirejs.config({
    paths: {
        'text': '../../Scripts/text',
        'durandal': '../../Scripts/durandal',
        'plugins': '../../Scripts/durandal/plugins',
        'transitions': '../../Scripts/durandal/transitions',
        'abp': '../../Abp',
        'services': '/api/serviceproxies',
        'service': '/Abp/Framework/scripts/libs/requirejs/plugins/service'
    }
});

define('jquery', function () { return jQuery; });
define('knockout', ko);

define(['durandal/system', 'durandal/app', 'durandal/viewLocator', 'durandal/viewEngine', 'durandal/activator', 'knockout'],
    function (system, app, viewLocator, viewEngine, activator, ko) {
    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");

    ko.punches.enableAll();

    ko.validation.init({
      decorateInputElement: true,
      parseInputAttributes: true,
    }, true);

    //This is needed to return deffered as return values in methods like canActivate.
    activator.defaults.interpretResponse = function (value) {
        if (system.isObject(value)) {
            value = value.can == undefined ? true : value.can;
        }

        if (system.isString(value)) {
            return ko.utils.arrayIndexOf(this.affirmations, value.toLowerCase()) !== -1;
        }

        return value == undefined ? true : value;
    };

    app.title = 'HR Concourse';

    app.configurePlugins({
        router: true,
        dialog: true,
        widget: true,
        observable: true
    });

    app.start().then(function() {
        //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
        //Look for partial views in a 'views' folder in the root.
        viewLocator.useConvention();

        //Show the app by setting the root view model for our application with a transition.
        app.setRoot('viewmodels/shell', 'entrance');
    });
});

define(['plugins/router'],
    function (router) {

        return new function () {
            var that = this;

            that.router = router;

            that.languages = abp.localization.languages;
            that.currentLanguage = abp.localization.currentLanguage;

            that.menu = abp.nav.menus.MainMenu;

            that.activate = function () {
                router.map([
                    { route: '', title: abp.localization.localize('HomePage', 'HRConcourse'), moduleId: 'viewmodels/home', nav: true, menuName: 'Home' },
                    { route: 'about', title: abp.localization.localize('About', 'HRConcourse'), moduleId: 'viewmodels/about', nav: true, menuName: 'About' }
                ]).buildNavigationModel();

                return that.router.activate();
            };
        };
    });
using System.Web.Optimization;

namespace HRConcourse.Web
{
    public static class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {

            bundles.IgnoreList.Clear();

            //VENDOR RESOURCES

            //~/Bundles/App/vendor/css
            bundles.Add(
                new StyleBundle("~/Bundles/App/vendor/css")
                    .Include("~/Content/themes/base/all.css", new CssRewriteUrlTransform())
                    .Include("~/Content/bootstrap.min.css")
                    .Include("~/Content/durandal.css")
                    .Include("~/Content/toastr.min.css")
                    .Include("~/Scripts/sweetalert/sweet-alert.css")
                    .Include("~/Content/flags/famfamfam-flags.css", new CssRewriteUrlTransform())
                    .Include("~/Content/font-awesome.min.css", new CssRewriteUrlTransform())
                    .Include("~/Content/bootstrap-datepicker3.min.css")
                    .Include("~/Content/jQuery.FileUpload/css/jquery.fileupload.css")
                );


            //~/Bundles/App/vendor/less
            bundles.Add(
              new LessBundle("~/Bundles/App/vendor/less")
                .Include("~/Content/theme/templates/admin/less/admin.less")
                .Include("~/Content/custom.less")
              );

            //~/Bundles/vendor/js/top (These scripts should be included in the head of the page)
            bundles.Add(
                new ScriptBundle("~/Bundles/vendor/js/top")
                    .Include(
                        "~/Abp/Framework/scripts/utils/ie10fix.js",
                        "~/Scripts/modernizr-2.8.3.js"
                    )
                );

            //~/Bundles/vendor/bottom (Included in the bottom for fast page load)
            bundles.Add(
                new ScriptBundle("~/Bundles/vendor/js/bottom")
                    .Include(
                        "~/Scripts/json2.min.js",

                        "~/Scripts/jquery-2.1.4.min.js",
                        "~/Scripts/jquery-ui-1.11.4.min.js",

                        "~/Scripts/jquery.validate*",

                         "~/Scripts/modernizr-*",

                        "~/Scripts/bootstrap.min.js",
                        "~/Scripts/bootstrap-datepicker.min.js",
                        "~/Scripts/respond.js",
                        "~/Scripts/moment-with-locales.min.js",
                        "~/Scripts/jquery.validate.min.js",
                        "~/Scripts/jquery.blockUI.js",
                        "~/Scripts/toastr.min.js",
                        "~/Scripts/sweetalert/sweet-alert.min.js",
                        "~/Scripts/others/spinjs/spin.js",
                        "~/Scripts/others/spinjs/jquery.spin.js",
                        "~/Scripts/jQuery.FileUpload/jquery.fileupload.js",

                        "~/Scripts/knockout-3.3.0.js",
                        "~/Scripts/knockout.mapping-latest.js",
                        "~/Scripts/knockout.punches.min.js",
                        "~/Scripts/knockout.validation.min.js",

                        "~/Abp/Framework/scripts/abp.js",
                        "~/Abp/Framework/scripts/libs/abp.jquery.js",
                        "~/Abp/Framework/scripts/libs/abp.toastr.js",
                        "~/Abp/Framework/scripts/libs/abp.blockUI.js",
                        "~/Abp/Framework/scripts/libs/abp.spin.js"
                    )
                );



            #region Application Resources

                        //~/Bundles/app/js/bottom
                        bundles.Add(
                       new ScriptBundle("~/Bundles/app/js/bottom")
                         .Include("~/Scripts/customBindings/*.js")
                             );


                        //~/Bundles/App/Main/css
                        bundles.Add(
                            new StyleBundle("~/Bundles/App/css")
                              .Include("~/Content/site.css")
                            );


            #endregion

        }
    }
}
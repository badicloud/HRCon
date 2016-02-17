using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace System.Web.Mvc
{
    public static class LocalizationHelpers
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA1801:ReviewUnusedParameters", MessageId = "html")]
        public static IHtmlString MetaAcceptLanguage<T>(this HtmlHelper<T> html)
        {
            var acceptLanguage = HttpUtility.HtmlAttributeEncode(System.Threading.Thread.CurrentThread.CurrentUICulture.ToString());
            return new HtmlString(String.Format(CultureInfo.InvariantCulture, "<meta name=\"accept-language\" content=\"{0}\">", acceptLanguage));
        }
    }
}
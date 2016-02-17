using Abp.Web.Mvc.Views;

namespace HRConcourse.Web.Views
{
    public abstract class HRConcourseWebViewPageBase : HRConcourseWebViewPageBase<dynamic>
    {

    }

    public abstract class HRConcourseWebViewPageBase<TModel> : AbpWebViewPage<TModel>
    {
        protected HRConcourseWebViewPageBase()
        {
            LocalizationSourceName = HRConcourseConsts.LocalizationSourceName;
        }
    }
}


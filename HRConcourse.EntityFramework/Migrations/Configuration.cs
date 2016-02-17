using System.Data.Entity.Migrations;
using HRConcourse.Migrations.SeedData;
using EntityFramework.DynamicFilters;
using HRConcourse.Migrations.DataMotions;

namespace HRConcourse.Migrations
{
    internal sealed class Configuration : DbMigrationsConfiguration<HRConcourse.EntityFramework.HRConcourseDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
            ContextKey = "HRConcourse";

        }

        protected override void Seed(HRConcourse.EntityFramework.HRConcourseDbContext context)
        {
            context.DisableAllFilters();
            new InitialDataBuilder(context).Build();
            new DataMotionRunner(context).Run();

        }
    }
}

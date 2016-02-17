using HRConcourse.EntityFramework;

namespace HRConcourse.Migrations.SeedData
{
    public class InitialDataBuilder
    {
        private readonly HRConcourseDbContext _context;

        public InitialDataBuilder(HRConcourseDbContext context)
        {
            _context = context;
        }

        public void Build()
        {
            new DefaultTenantRoleAndUserBuilder(_context).Build();
        }
    }
}

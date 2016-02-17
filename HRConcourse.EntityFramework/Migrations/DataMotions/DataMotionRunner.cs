using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HRConcourse.EntityFramework;
using HRConcourse.Migrations.SeedData;

namespace HRConcourse.Migrations.DataMotions
{
    public class DataMotionRunner
    {
        private readonly HRConcourseDbContext _context;

        public DataMotionRunner(HRConcourseDbContext context)
        {
            _context = context;
        }

        public void Run()
        {
        }
    }
}

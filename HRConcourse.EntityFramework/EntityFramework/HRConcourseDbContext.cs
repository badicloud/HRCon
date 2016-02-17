using System.Data.Common;
using Abp.Zero.EntityFramework;
using HRConcourse.Authorization.Roles;
using HRConcourse.MultiTenancy;
using HRConcourse.Users;
using HRConcourse.Documents;
using System.Data.Entity;
using System.Data.Entity.Core.Objects;
using HRConcourse.Entries;
using HRConcourse.PdfRendering;
using HRConcourse.ReadModels;
using HRConcourse.Migrations;

namespace HRConcourse.EntityFramework
{
    public class HRConcourseDbContext : AbpZeroDbContext<Tenant, Role, User>
    {

        //Agregate roots
        public virtual IDbSet<Document> Documents { get; set; }
        public virtual IDbSet<Image> Images { get; set; }
        public virtual IDbSet<MergeField> MergeFields { get; set; }
        public virtual IDbSet<Revision> Revisions { get; set; }
        public virtual IDbSet<DocumentEntry> DocumentEntries { get; set; }
        public virtual IDbSet<EntryPdfRenderReadModel> EntryPdfRenderReadModels { get; set; }
        //Read models
        public virtual IDbSet<DocumentReadModel> DocumentReadModels { get; set; }
        /* NOTE: 
         *   Setting "Default" to base class helps us when working migration commands on Package Manager Console.
         *   But it may cause problems when working Migrate.exe of EF. If you will apply migrations on command line, do not
         *   pass connection string name to base classes. ABP works either way.
         */
        public HRConcourseDbContext()
            : base("Default")
        {
            this.Configuration.LazyLoadingEnabled = true;
        }

        /* NOTE:
         *   This constructor is used by ABP to pass connection string defined in HRConcourseDataModule.PreInitialize.
         *   Notice that, actually you will not directly create an instance of HRConcourseDbContext since ABP automatically handles it.
         */
        public HRConcourseDbContext(string nameOrConnectionString)
            : base(nameOrConnectionString)
        {
            this.Configuration.LazyLoadingEnabled = true;
        }

        //This constructor is used in tests
        public HRConcourseDbContext(DbConnection connection)
            : base(connection, true)
        {
          
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
         //   modelBuilder.Entity<Document>().
         //       HasOptional(p => p.DraftRevision).WithMany()
         //   modelBuilder.Entity<Document>().
         //HasOptional(p => p.ActiveRevision).WithMany();
  
            base.OnModelCreating(modelBuilder);
        }
    }
}

namespace HRConcourse.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CleanPreRenders : DbMigration
    {
        public override void Up()
        {
            Sql("delete  from EntryPdfRenderReadModels");
        }
        
        public override void Down()
        {
        }
    }
}

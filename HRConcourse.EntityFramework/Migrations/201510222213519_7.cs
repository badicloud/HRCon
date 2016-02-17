namespace HRConcourse.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _7 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.DocumentEntries", "RevisionId", "dbo.Revisions");
            DropIndex("dbo.DocumentEntries", new[] { "RevisionId" });
        }
        
        public override void Down()
        {
            CreateIndex("dbo.DocumentEntries", "RevisionId");
            AddForeignKey("dbo.DocumentEntries", "RevisionId", "dbo.Revisions", "Id", cascadeDelete: true);
        }
    }
}

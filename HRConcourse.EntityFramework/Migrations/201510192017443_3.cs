namespace HRConcourse.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _3 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.DocumentEntries", "Revision_Id", "dbo.Revisions");
            DropIndex("dbo.DocumentEntries", new[] { "Revision_Id" });
            RenameColumn(table: "dbo.DocumentEntries", name: "Revision_Id", newName: "RevisionId");
            AlterColumn("dbo.DocumentEntries", "RevisionId", c => c.Int(nullable: false));
            CreateIndex("dbo.DocumentEntries", "RevisionId");
            AddForeignKey("dbo.DocumentEntries", "RevisionId", "dbo.Revisions", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.DocumentEntries", "RevisionId", "dbo.Revisions");
            DropIndex("dbo.DocumentEntries", new[] { "RevisionId" });
            AlterColumn("dbo.DocumentEntries", "RevisionId", c => c.Int());
            RenameColumn(table: "dbo.DocumentEntries", name: "RevisionId", newName: "Revision_Id");
            CreateIndex("dbo.DocumentEntries", "Revision_Id");
            AddForeignKey("dbo.DocumentEntries", "Revision_Id", "dbo.Revisions", "Id");
        }
    }
}

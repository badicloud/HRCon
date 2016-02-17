namespace HRConcourse.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Remove_RevisionsCollection_from_document : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Revisions", "Document_Id", "dbo.Documents");
            DropIndex("dbo.Revisions", new[] { "Document_Id" });
            DropColumn("dbo.Revisions", "Document_Id");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Revisions", "Document_Id", c => c.Int());
            CreateIndex("dbo.Revisions", "Document_Id");
            AddForeignKey("dbo.Revisions", "Document_Id", "dbo.Documents", "Id");
        }
    }
}

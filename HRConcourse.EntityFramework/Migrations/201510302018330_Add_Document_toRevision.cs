namespace HRConcourse.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Add_Document_toRevision : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Revisions", "Document_Id", c => c.Int());
            CreateIndex("dbo.Revisions", "Document_Id");
            AddForeignKey("dbo.Revisions", "Document_Id", "dbo.Documents", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Revisions", "Document_Id", "dbo.Documents");
            DropIndex("dbo.Revisions", new[] { "Document_Id" });
            DropColumn("dbo.Revisions", "Document_Id");
        }
    }
}

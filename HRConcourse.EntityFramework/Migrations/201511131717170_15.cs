namespace HRConcourse.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _15 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Revisions", "Document_Id", "dbo.Documents");
            DropIndex("dbo.Revisions", new[] { "Document_Id" });
            AddColumn("dbo.Fields", "ShowInSearch", c => c.Boolean(nullable: false));
            DropColumn("dbo.Documents", "IsReadOnly");
            DropColumn("dbo.Documents", "RequiresHardSignature");
            DropColumn("dbo.Revisions", "Document_Id");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Revisions", "Document_Id", c => c.Int());
            AddColumn("dbo.Documents", "RequiresHardSignature", c => c.Boolean(nullable: false));
            AddColumn("dbo.Documents", "IsReadOnly", c => c.Boolean(nullable: false));
            DropColumn("dbo.Fields", "ShowInSearch");
            CreateIndex("dbo.Revisions", "Document_Id");
            AddForeignKey("dbo.Revisions", "Document_Id", "dbo.Documents", "Id");
        }
    }
}

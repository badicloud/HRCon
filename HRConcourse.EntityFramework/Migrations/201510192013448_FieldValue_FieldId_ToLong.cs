namespace HRConcourse.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class FieldValue_FieldId_ToLong : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.DocumentEntries", "Document_Id", "dbo.Documents");
            DropIndex("dbo.DocumentEntries", new[] { "Document_Id" });
            AddColumn("dbo.DocumentEntries", "Revision_Id", c => c.Int());
            AlterColumn("dbo.FieldValues", "FieldId", c => c.Long(nullable: false));
            CreateIndex("dbo.DocumentEntries", "Revision_Id");
            AddForeignKey("dbo.DocumentEntries", "Revision_Id", "dbo.Revisions", "Id");
            DropColumn("dbo.DocumentEntries", "SubmittedRevisionId");
            DropColumn("dbo.DocumentEntries", "Document_Id");
        }
        
        public override void Down()
        {
            AddColumn("dbo.DocumentEntries", "Document_Id", c => c.Int());
            AddColumn("dbo.DocumentEntries", "SubmittedRevisionId", c => c.Int());
            DropForeignKey("dbo.DocumentEntries", "Revision_Id", "dbo.Revisions");
            DropIndex("dbo.DocumentEntries", new[] { "Revision_Id" });
            AlterColumn("dbo.FieldValues", "FieldId", c => c.Int(nullable: false));
            DropColumn("dbo.DocumentEntries", "Revision_Id");
            CreateIndex("dbo.DocumentEntries", "Document_Id");
            AddForeignKey("dbo.DocumentEntries", "Document_Id", "dbo.Documents", "Id");
        }
    }
}

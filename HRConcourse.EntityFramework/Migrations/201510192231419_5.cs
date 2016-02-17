namespace HRConcourse.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _5 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.EntryPdfRenderReadModels",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        EntryId = c.Int(nullable: false),
                        PdfFile = c.Binary(),
                        LastModificationTime = c.DateTime(),
                        LastModifierUserId = c.Long(),
                        CreationTime = c.DateTime(nullable: false),
                        CreatorUserId = c.Long(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.EntryPdfRenderReadModels");
        }
    }
}

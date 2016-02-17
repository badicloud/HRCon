namespace HRConcourse.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Added_Style_To_Field : DbMigration
    {
        public override void Up()
        {
           
            AddColumn("dbo.Fields", "Style", c => c.String());
            DropColumn("dbo.Fields", "IsOutField");
            DropColumn("dbo.Fields", "OutputMergeFieldId");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Fields", "OutputMergeFieldId", c => c.Guid(nullable: false));
            AddColumn("dbo.Fields", "IsOutField", c => c.Boolean(nullable: false));
            DropColumn("dbo.Fields", "Style");
        }
    }
}

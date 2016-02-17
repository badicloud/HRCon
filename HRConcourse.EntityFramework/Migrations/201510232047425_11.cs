namespace HRConcourse.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _11 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AbpUsers", "ClientSecret", c => c.String());
            AddColumn("dbo.AbpUsers", "ClientId", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.AbpUsers", "ClientId");
            DropColumn("dbo.AbpUsers", "ClientSecret");
        }
    }
}

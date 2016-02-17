namespace HRConcourse.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _13 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Fields", "DependencyCount", c => c.Short(nullable: false));
            AlterColumn("dbo.Fields", "CustomValidationCount", c => c.Short(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Fields", "CustomValidationCount", c => c.Short());
            AlterColumn("dbo.Fields", "DependencyCount", c => c.Short());
        }
    }
}

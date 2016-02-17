namespace HRConcourse.Migrations
{
    using System;
    using System.Collections.Generic;
    using System.Data.Entity.Infrastructure.Annotations;
    using System.Data.Entity.Migrations;
    
    public partial class _1 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.DocumentEntries",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        SubmittedRevisionId = c.Int(),
                        IsDeleted = c.Boolean(nullable: false),
                        DeleterUserId = c.Long(),
                        DeletionTime = c.DateTime(),
                        LastModificationTime = c.DateTime(),
                        LastModifierUserId = c.Long(),
                        CreationTime = c.DateTime(nullable: false),
                        CreatorUserId = c.Long(),
                        Document_Id = c.Int(),
                    },
                annotations: new Dictionary<string, object>
                {
                    { "DynamicFilter_DocumentEntry_SoftDelete", "EntityFramework.DynamicFilters.DynamicFilterDefinition" },
                })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Documents", t => t.Document_Id)
                .Index(t => t.Document_Id);
            
            CreateTable(
                "dbo.Documents",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        IsReadOnly = c.Boolean(nullable: false),
                        RequiresHardSignature = c.Boolean(nullable: false),
                        TenantId = c.Int(nullable: false),
                        IsDeleted = c.Boolean(nullable: false),
                        DeleterUserId = c.Long(),
                        DeletionTime = c.DateTime(),
                        LastModificationTime = c.DateTime(),
                        LastModifierUserId = c.Long(),
                        CreationTime = c.DateTime(nullable: false),
                        CreatorUserId = c.Long(),
                        ActiveRevision_Id = c.Int(),
                        DraftRevision_Id = c.Int(),
                    },
                annotations: new Dictionary<string, object>
                {
                    { "DynamicFilter_Document_MustHaveTenant", "EntityFramework.DynamicFilters.DynamicFilterDefinition" },
                    { "DynamicFilter_Document_SoftDelete", "EntityFramework.DynamicFilters.DynamicFilterDefinition" },
                })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Revisions", t => t.ActiveRevision_Id)
                .ForeignKey("dbo.Revisions", t => t.DraftRevision_Id)
                .Index(t => t.ActiveRevision_Id)
                .Index(t => t.DraftRevision_Id);
            
            CreateTable(
                "dbo.Revisions",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        LastModificationTime = c.DateTime(),
                        LastModifierUserId = c.Long(),
                        CreationTime = c.DateTime(nullable: false),
                        CreatorUserId = c.Long(),
                        Document_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Documents", t => t.Document_Id)
                .Index(t => t.Document_Id);
            
            CreateTable(
                "dbo.Pages",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ImageId = c.Int(),
                        Number = c.Int(nullable: false),
                        HasToBeFilled = c.Boolean(nullable: false),
                        Revision_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Revisions", t => t.Revision_Id)
                .Index(t => t.Revision_Id);
            
            CreateTable(
                "dbo.Fields",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        FieldId = c.String(),
                        FieldName = c.String(),
                        Tooltip = c.String(),
                        Html = c.String(),
                        FieldType = c.Int(nullable: false),
                        InitialValue = c.String(),
                        Href = c.String(),
                        IsOutField = c.Boolean(nullable: false),
                        OutputMergeFieldId = c.Guid(nullable: false),
                        FontSize = c.Decimal(precision: 18, scale: 2),
                        TabIndex = c.Short(),
                        Required = c.Boolean(nullable: false),
                        Pattern = c.String(),
                        MinimumLength = c.Short(),
                        MaxLength = c.Short(),
                        Min = c.Int(),
                        Max = c.Int(),
                        MinSelected = c.Short(),
                        DataEquals = c.String(),
                        UseCurrentDate = c.Boolean(nullable: false),
                        RangeDateMin = c.String(),
                        RangeDateMinUseCurrent = c.Boolean(),
                        RangeDateMax = c.String(),
                        RangeDateMaxUseCurrent = c.Boolean(),
                        DependencyCount = c.Short(nullable: false),
                        SelectTitle = c.String(),
                        SelectFieldSource = c.String(),
                        ReadOnly = c.Boolean(nullable: false),
                        DependencyData = c.String(),
                        IsGroup = c.Boolean(),
                        CustomValidationCount = c.Short(nullable: false),
                        CustomValidationData = c.String(),
                        Page_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Pages", t => t.Page_Id)
                .Index(t => t.Page_Id);
            
            CreateTable(
                "dbo.FieldValues",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        FieldId = c.Int(nullable: false),
                        Value = c.String(),
                        DocumentEntry_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.DocumentEntries", t => t.DocumentEntry_Id)
                .Index(t => t.DocumentEntry_Id);
            
            CreateTable(
                "dbo.DocumentReadModels",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        DocumentId = c.Int(nullable: false),
                        TenantId = c.Int(nullable: false),
                        Name = c.String(),
                        CreationDate = c.DateTime(nullable: false),
                        Packages = c.String(),
                        RequiresHardSignature = c.Boolean(nullable: false),
                        IsReadOnly = c.Boolean(nullable: false),
                        ActiveRevisionId = c.Int(),
                        WorkingRevisionId = c.Int(nullable: false),
                        WorkingRevisionNumber = c.Int(nullable: false),
                        InstanceCount = c.Int(nullable: false),
                        ActiveRevisionNumber = c.Int(nullable: false),
                        DocumentTypeId = c.Int(),
                        DocumentTypeName = c.String(),
                    },
                annotations: new Dictionary<string, object>
                {
                    { "DynamicFilter_DocumentReadModel_MustHaveTenant", "EntityFramework.DynamicFilters.DynamicFilterDefinition" },
                })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Images",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Data = c.Binary(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.MergeFields",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Key = c.String(),
                        TestValue = c.String(),
                        IsForPostback = c.Boolean(nullable: false),
                        Type = c.Int(nullable: false),
                        TenantId = c.Int(nullable: false),
                    },
                annotations: new Dictionary<string, object>
                {
                    { "DynamicFilter_MergeField_MustHaveTenant", "EntityFramework.DynamicFilters.DynamicFilterDefinition" },
                })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.FieldValues", "DocumentEntry_Id", "dbo.DocumentEntries");
            DropForeignKey("dbo.DocumentEntries", "Document_Id", "dbo.Documents");
            DropForeignKey("dbo.Revisions", "Document_Id", "dbo.Documents");
            DropForeignKey("dbo.Documents", "DraftRevision_Id", "dbo.Revisions");
            DropForeignKey("dbo.Documents", "ActiveRevision_Id", "dbo.Revisions");
            DropForeignKey("dbo.Pages", "Revision_Id", "dbo.Revisions");
            DropForeignKey("dbo.Fields", "Page_Id", "dbo.Pages");
            DropIndex("dbo.FieldValues", new[] { "DocumentEntry_Id" });
            DropIndex("dbo.Fields", new[] { "Page_Id" });
            DropIndex("dbo.Pages", new[] { "Revision_Id" });
            DropIndex("dbo.Revisions", new[] { "Document_Id" });
            DropIndex("dbo.Documents", new[] { "DraftRevision_Id" });
            DropIndex("dbo.Documents", new[] { "ActiveRevision_Id" });
            DropIndex("dbo.DocumentEntries", new[] { "Document_Id" });
            DropTable("dbo.MergeFields",
                removedAnnotations: new Dictionary<string, object>
                {
                    { "DynamicFilter_MergeField_MustHaveTenant", "EntityFramework.DynamicFilters.DynamicFilterDefinition" },
                });
            DropTable("dbo.Images");
            DropTable("dbo.DocumentReadModels",
                removedAnnotations: new Dictionary<string, object>
                {
                    { "DynamicFilter_DocumentReadModel_MustHaveTenant", "EntityFramework.DynamicFilters.DynamicFilterDefinition" },
                });
            DropTable("dbo.FieldValues");
            DropTable("dbo.Fields");
            DropTable("dbo.Pages");
            DropTable("dbo.Revisions");
            DropTable("dbo.Documents",
                removedAnnotations: new Dictionary<string, object>
                {
                    { "DynamicFilter_Document_MustHaveTenant", "EntityFramework.DynamicFilters.DynamicFilterDefinition" },
                    { "DynamicFilter_Document_SoftDelete", "EntityFramework.DynamicFilters.DynamicFilterDefinition" },
                });
            DropTable("dbo.DocumentEntries",
                removedAnnotations: new Dictionary<string, object>
                {
                    { "DynamicFilter_DocumentEntry_SoftDelete", "EntityFramework.DynamicFilters.DynamicFilterDefinition" },
                });
        }
    }
}

﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ConsoleApplication2
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class HRConcourseDCEntities : DbContext
    {
        public HRConcourseDCEntities()
            : base("name=HRConcourseDCEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<DocumentInstanceFiles> DocumentInstanceFiles { get; set; }
        public virtual DbSet<DocumentPageTranslations> DocumentPageTranslations { get; set; }
        public virtual DbSet<MergeFieldInstanceValues> MergeFieldInstanceValues { get; set; }
        public virtual DbSet<ObjRoots> ObjRoots { get; set; }
        public virtual DbSet<ObjRoots_ComboGroup> ObjRoots_ComboGroup { get; set; }
        public virtual DbSet<ObjRoots_ComboValue> ObjRoots_ComboValue { get; set; }
        public virtual DbSet<ObjRoots_Document> ObjRoots_Document { get; set; }
        public virtual DbSet<ObjRoots_DocumentInstance> ObjRoots_DocumentInstance { get; set; }
        public virtual DbSet<ObjRoots_DocumentInstanceLog> ObjRoots_DocumentInstanceLog { get; set; }
        public virtual DbSet<ObjRoots_DocumentInstanceMessage> ObjRoots_DocumentInstanceMessage { get; set; }
        public virtual DbSet<ObjRoots_DocumentPackage> ObjRoots_DocumentPackage { get; set; }
        public virtual DbSet<ObjRoots_DocumentPage> ObjRoots_DocumentPage { get; set; }
        public virtual DbSet<ObjRoots_DocumentPageInstance> ObjRoots_DocumentPageInstance { get; set; }
        public virtual DbSet<ObjRoots_DocumentType> ObjRoots_DocumentType { get; set; }
        public virtual DbSet<ObjRoots_ExternalGuidFillToken> ObjRoots_ExternalGuidFillToken { get; set; }
        public virtual DbSet<ObjRoots_MergeField> ObjRoots_MergeField { get; set; }
        public virtual DbSet<ObjRoots_Notification> ObjRoots_Notification { get; set; }
        public virtual DbSet<ObjRoots_PageField> ObjRoots_PageField { get; set; }
        public virtual DbSet<ObjRoots_PageImage> ObjRoots_PageImage { get; set; }
        public virtual DbSet<PageFieldTranslations> PageFieldTranslations { get; set; }
        public virtual DbSet<Sys_DataMotions> Sys_DataMotions { get; set; }
        public virtual DbSet<UserTokens> UserTokens { get; set; }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;

namespace HRConcourse.Documents
{
    public class Document : FullAuditedEntity, IMustHaveTenant
    {
        public string Name { get; set; }

        public virtual Revision ActiveRevision { get; set; }

        public virtual Revision DraftRevision { get; set; }

        public int TenantId { get; set; }


        public void SetSearchFields(IEnumerable<string> fieldNames)
        {
            var fieldNamesList = fieldNames.ToList();
            var activeRevisionFields = ActiveRevision.Pages.SelectMany(p => p.Fields);
            var draftRevisionFields = DraftRevision.Pages.SelectMany(p => p.Fields);
            foreach (var activeRevisionField in activeRevisionFields)
            {
                activeRevisionField.ShowInSearch = fieldNamesList.Contains(activeRevisionField.FieldName);
            }
            foreach (var activeRevisionField in draftRevisionFields)
            {
                activeRevisionField.ShowInSearch = fieldNamesList.Contains(activeRevisionField.FieldName);
            }
        }

        public IEnumerable<string> GetSearchFields()
        {
            return ActiveRevision.Pages.SelectMany(p => p.Fields).Where(p => p.ShowInSearch).Select(p => p.FieldName);
        } 

        public void PublishDraft()
        {
            if (DraftRevision == null)
                throw new Exception("No draft to publish");
            ActiveRevision = DraftRevision;
            DraftRevision = null;
        }

        /// <summary>
        ///     Creates a draft revision from the active one. If no active revision just starts a blank draft.
        /// </summary>
        public void CreateDraft()
        {
            //IF there is already a draft revision do nothing.
            if (DraftRevision != null)
                return;
            if (ActiveRevision == null)
            {
                DraftRevision = new Revision();
            }
            if (ActiveRevision != null)
            {
                DraftRevision = (Revision) ActiveRevision.Clone();
            }
        }
    }
}
using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using HRConcourse.Documents;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Castle.Components.DictionaryAdapter;

namespace HRConcourse.Documents
{
    public class Page : Entity, ICloneable
    {
        public int? ImageId { get; set; }

        public int Number { get; set; }

        public bool HasToBeFilled { get; set; }

        public virtual List<Field> Fields { get; private set; }


        public Page()
        {
            this.Fields = new EditableList<Field>();
        }

        public object Clone()
        {

            var page = new Page
            {
                ImageId = this.ImageId,
                Number = Number
            };
            page.HasToBeFilled = page.HasToBeFilled;
            foreach (var field in Fields)
            {
                var clonedField = (Field) field.Clone();
                page.Fields.Add(clonedField);
            }
            return page;
        }
    }
}

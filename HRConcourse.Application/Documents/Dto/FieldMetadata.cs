using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Abp.AutoMapper;

namespace HRConcourse.Documents
{
    [AutoMapFrom(typeof(Field))]
    [AutoMapTo(typeof(Field))]
    public class FieldMetadata
    {

        public string FieldId { get; set; }


        public string FieldName { get; set; }


        public string Tooltip { get; set; }


        public string Html { get; set; }


        public FieldType FieldType { get; set; }


        public string InitialValue { get; set; }


        public string Href { get; set; }

        
        public decimal? FontSize { get; set; }


        public short? TabIndex { get; set; }


        public bool Required { get; set; }


        public string Pattern { get; set; }


        public short? MinimumLength { get; set; }


        public short? MaxLength { get; set; }


        public int? Min { get; set; }


        public int? Max { get; set; }


        public short? MinSelected { get; set; }


        public string DataEquals { get; set; }


        public bool UseCurrentDate { get; set; }


        public string RangeDateMin { get; set; }


        public bool? RangeDateMinUseCurrent { get; set; }


        public string RangeDateMax { get; set; }


        public bool? RangeDateMaxUseCurrent { get; set; }


        public short DependencyCount { get; set; }


        public string SelectTitle { get; set; }


        public string SelectFieldSource { get; set; }

        

        public bool ReadOnly { get; set; }


        public string DependencyData { get; set; }


        public bool? IsGroup { get; set; }


        public short CustomValidationCount { get; set; }


        public string CustomValidationData { get; set; }

        public string Style { get; set; }

        
    }
}

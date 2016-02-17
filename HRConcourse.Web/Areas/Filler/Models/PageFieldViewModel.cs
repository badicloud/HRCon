using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRConcourse.Web.Areas.Filler.Models
{
    class PageFieldViewModel
    {

        public Guid Id { get; set; }


        public string FieldId { get; set; }


        public string FieldName { get; set; }


        public string Tooltip { get; set; }


        public string Html { get; set; }


        public FieldType FieldType { get; set; }


        public string InitialValue { get; set; }


        public string Href { get; set; }


        public bool IsOutField { get; set; }


        public Guid? OutFieldId { get; set; }


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


        public string SelectPrefixedSource { get; set; }


        public bool ReadOnly { get; set; }


        public string DependencyData { get; set; }


        public bool? IsGroup { get; set; }


        public short CustomValidationCount { get; set; }


        public string CustomValidationData { get; set; }


        public string Style { get; set; }


        public Guid DocumentPageModelId { get; set; }



    }

    public enum FieldType : int
    {
        /// <summary>
        /// No Metadata Documentation available.
        /// </summary>
        Text = 1,

        /// <summary>
        /// No Metadata Documentation available.
        /// </summary>
        Password = 2,

        /// <summary>
        /// No Metadata Documentation available.
        /// </summary>
        Number = 3,

        /// <summary>
        /// No Metadata Documentation available.
        /// </summary>
        Email = 4,

        /// <summary>
        /// No Metadata Documentation available.
        /// </summary>
        DatePicker = 5,

        /// <summary>
        /// No Metadata Documentation available.
        /// </summary>
        Empty = 6,

        /// <summary>
        /// No Metadata Documentation available.
        /// </summary>
        Radio = 7,

        /// <summary>
        /// No Metadata Documentation available.
        /// </summary>
        Checkbox = 8,

        /// <summary>
        /// No Metadata Documentation available.
        /// </summary>
        Select = 9,

        /// <summary>
        /// No Metadata Documentation available.
        /// </summary>
        Label = 10,

        /// <summary>
        /// No Metadata Documentation available.
        /// </summary>
        Canvas = 11,

        /// <summary>
        /// No Metadata Documentation available.
        /// </summary>
        Link = 12
    }
}

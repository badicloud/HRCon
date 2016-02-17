/// <reference path="jquery-1.7.1.js"/>
/// <reference path="formsCommon.js"/>

/** Auxiliary global variables **/
var SUBMITTED_DATA_SECTIONS = 'submittedData',
    METADATA_SECTIONS = 'metadata';


function setupMetadata(pageSection) {
    /// <summary>Sets the metadata loaded into the page on the corresponding fields.</summary>
    /// <param name="pageSection" type="DOM">The DOM representation of the page section.</param>
    /// <returns type="void"></returns>

    // parse and transforms the metadata loaded on the page, to use it on the fields
    var met = pageSection.find('#' + METADATA_SECTIONS);
    var metadataArray = jQuery.parseJSON(met.html());
    met.remove(); // remove the metadata section - bc was causing performance problems
    transformMetadataToFieldsData(metadataArray);  // common.js

    // copy data information on the fields when needed
    for (var i = 0; i < metadataArray.length; i++) {
        var fieldId = metadataArray[i]['FieldId'];
        var fieldContainer = pageSection.find('#' + fieldId);
        fieldsDataStructure[fieldId] = {};
        fieldsDataStructure[fieldId].container = fieldContainer;
        fieldsDataStructure[fieldId].type = metadataArray[i][DATA_FIELD_TYPE];
        fieldsDataStructure[fieldId].innerFields = fieldContainer.find(INNER_FIELDS);
        setHtmlMetadata(metadataArray[i], fieldContainer);  // common.js
    }
}


function setupFieldsValues(pageSection, mergeFieldValuesDictionary) {
    /// <summary>Sets the values of the fields, whether they are initial values or submitted values.</summary>
    /// <param name="pageSection" type="DOM">The DOM representation of the page section.</param>
    /// <param name="mergeFieldValuesDictionary" type="Object">The merge field instance values dictionary.</param>
    /// <returns type="void"></returns>

    // setup initial values
    prepareInitialValues(pageSection, mergeFieldValuesDictionary);      // common.js

    // set initial values
    setInitialValues(pageSection);      // common.js

    var submittedDataSection = pageSection.find('#' + SUBMITTED_DATA_SECTIONS).html();
    if (submittedDataSection !== '{}' && submittedDataSection !== '') {
        // set submitted values
        var submittedValues = JSON.parse(submittedDataSection);
        setSubmittedValues(pageSection, submittedValues);
    }
}



/** Setup the submitted values **/
function setSubmittedValues(pageSection, submittedValuesDictionary) {
    var fieldContainers = pageSection.find(FIELD_CONTAINER);
    fieldContainers.find(TEXT_INPUT + ', ' + PASSWORD_INPUT + ', ' + EMAIL_INPUT + ', ' + NUMBER_INPUT + ', select').each(function () {
        var fieldName = $(this).attr('name');
        if (submittedValuesDictionary[fieldName] !== undefined) {
            $(this).val(submittedValuesDictionary[fieldName]);
        }
    });
    fieldContainers.find(DATEPICKER_INPUT).each(function () {
        var fieldName = $(this).attr('name');
        //Set the date when the submitted value is not empty
        if (submittedValuesDictionary[fieldName] !== undefined && submittedValuesDictionary[fieldName] !== '') {
            var parsedDate = Date.parse(submittedValuesDictionary[fieldName]);
            if (!isNaN(parsedDate)) {
                $(this).datepicker("setDate", new Date(parsedDate));
            }
        }
        //Set the date when the submitted value is empty ( this is different than the above because an empty date cannot be parsed)
        if (submittedValuesDictionary[fieldName] !== undefined && submittedValuesDictionary[fieldName] == '') {          
            $(this).datepicker("setDate", '');            
        }
    });
    fieldContainers.find(RADIO_INPUT).each(function () {
        var fieldName = $(this).attr('name');
        if (submittedValuesDictionary[fieldName] !== undefined && submittedValuesDictionary[fieldName] === $(this).val()) {
            $(this).attr('checked', 'checked');
            $(this).parent().addClass('checked');
        }
    });
    fieldContainers.find(CHECKBOX_INPUT).each(function () {
        var fieldName = $(this).attr('name');
        if (submittedValuesDictionary[fieldName] !== undefined) {
            var submittedValues = submittedValuesDictionary[fieldName].split(',');
            for (var i = 0; i < submittedValues.length; i++) {
                if (submittedValues[i] === $(this).val()) {
                    $(this).attr('checked', 'checked');
                    $(this).parent().addClass('checked');
                }
            }
        }
    });
    pageSection.find(FIELD_CONTAINER + '.' + SIGNATURE_PAD_CLASS).each(function () {
        var fieldName = $(this).find(SIGNATURE_INNER_INPUT).attr('name');
        if (submittedValuesDictionary[fieldName] !== undefined && submittedValuesDictionary[fieldName] !== '') {
            $(this).data(DATA_SIGNATURE_PAD).regenerate(submittedValuesDictionary[fieldName]);
        }
    });
}
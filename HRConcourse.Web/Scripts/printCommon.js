/// <reference path="jquery-1.7.1.js"/>
/// <reference path="formsCommon.js"/>
/// <reference path="viewCommon.js"/>

function setPage(pageSection) {

    // set fields metadata
    setupMetadata(pageSection);     // viewCommon.js

    // load 'select' fields values from server, when using 'premade fixed' option as source
    loadSelectPrefixedValues(pageSection);  // common.js

    // load datepicker plugin
    pageSection.find(DATEPICKER_INPUT).each(function () {
        $(this).datepicker();
        // if the current-date option was set, use today date. Or use the initial value, if it was set
        if ($(this).attr('current-date') !== undefined && $(this).attr('current-date') === 'checked') {
            $(this).datepicker("setDate", new Date());
        }
    });

    // add and empty first value for select fields, as a title
    // the value used is the one defined on the designer
    pageSection.find('select').each(function () {
        var id = $(this).attr('id') + '-0';
        var emptyOption = '<option id=\"' + id + '\" value=\"\">' + $(this).attr('select-title') + '</option>';
        $(this).prepend(emptyOption).val('');
    });

    // setup signature pad plugin
    pageSection.find(FIELD_CONTAINER + '.' + SIGNATURE_PAD_CLASS).each(function () {
        var padWidth = $(this).css('width').replace('px', ''),
        padHeight = $(this).css('height').replace('px', '');

        // the canvas width and height need to be as attributes
        $(this).find('canvas').attr('width', padWidth);
        $(this).find('canvas').attr('height', padHeight);

        // apply the signature pad plugin
        $(this).data(DATA_SIGNATURE_PAD, $(this).signaturePad({
            defaultAction: 'drawIt',    // to use the draw function as default
            displayOnly: true,          // to only allow the display function
            lineTop: -2,                // to hide line that the plugin draws on the canvas
            validateFields: false       // we use our own validation plugin and custom function on this
        }));
    });

    // setup initial values
    setupFieldsValues(pageSection, mergeFieldValuesDictionary);      // viewCommon.js

    // enable dependency validation settings
    $documentSection = pageSection;
    setPageDependencies(pageSection);  // common.js
    
    // apply uniform plugin to checkboxes and radio buttons
    pageSection.find(CHECKBOX_RADIO_INPUTS).uniform();

    // after all is loaded and working, replace checkboxes/radio buttons for their respective images
    pageSection.find(CHECKBOX_INPUT).each(function () {
        if ($(this).parent('span').hasClass('checked')) {
            $(this).parent('span').parent('div').html('<img src="' + getFullyQualifiedURL('../../Images/checkboxChecked.png') + '" alt="" />');
        } else {
            $(this).parent('span').parent('div.checker').remove();
        }
    });
    pageSection.find(RADIO_INPUT).each(function () {
        if ($(this).parent('span').hasClass('checked')) {
            $(this).parent('span').parent('div').html('<img src="' + getFullyQualifiedURL('../../Images/radiobuttonChecked.png') + '" alt="" />');
        } else {
            $(this).parent('span').parent('div.radio').remove();
        }
    });
}

function transformInputsToText() {
    // Transform select fields to text
    $('.TTWForm select').each(function () {
        $(this).replaceWith(function () {
            var input = '<input type=text value="' + $(this).val() + '"';
            input += ' style="' + $(this).attr('style') + '"';
            input += ' />';
            return input;
        });
    });

    // Transform number fields to text
    $('.TTWForm input[type="number"]').each(function () {
        $(this).replaceWith(function () {
            var input = '<input type=text value="' + $(this).attr('value') + '"';
            input += ' style="' + $(this).attr('style') + '"';
            input += ' />';
            return input;
        });
    });

    // setup signature pad plugin
    $('.TTWForm div.field.sigPad').each(function () {
        var padWidth = $(this).css('width').replace('px', ''),
            padHeight = $(this).css('height').replace('px', '');

        $(this).find('canvas').attr('width', padWidth);
        $(this).find('canvas').attr('height', padHeight);

        var outputFieldValue = $(this).find('input[type=hidden].output').attr('value');

        $(this).data('signaturePad', $(this).signaturePad({
            defaultAction: 'drawIt',
            drawOnly: true,
            lineTop: -2,
            validateFields: false
        }));

        if (outputFieldValue !== undefined && outputFieldValue !== '') {
            $(this).data('signaturePad').regenerate(outputFieldValue);
        }
    });
}

function loadSelectPrefixedValues(pageSection) {
    $(pageSection).find(PREMADE_SELECT_FIELDS).each(function () {
        var selectListControl = $(this),
            idToLoad = selectListControl.attr(PREFIXED_SOURCE_ID_ATTR);

        // clear any previous value
        selectListControl.find('option').remove();

        var data = selectPrefixValues[idToLoad];
        $.each(data, function (value, text) {
            var option = '<option value=\"' + value + '\">' + text + '</option>';
            selectListControl.append(option);
        });
    });
}
/// <reference path="jquery-1.7.1.js"/>
/// <reference path="json2.js"/>
/// <reference path="jquery-ui-1.8.9.custom.min.js"/>
/// <reference path="jquery.html5type.js"/>
/// <reference path="jquery.tools.validator.js"/>

/** Auxiliary global variables **/
var fieldDataProperties = ['name', 'tooltip', 'initialvalue', 'href', 'outFieldId', 'read-only', 'tabindex', 'grouping', 'select-title', 'selectfield-source', 'select-prefixed-source', 'required', 'pattern', 'minimumlength', 'maxlength', 'min', 'max', 'min-selected', 'data-equals', 'current-date', 'rangedate-min', 'rangedate-min-current', 'rangedate-max', 'rangedate-max-current', 'validation-count', 'dependency-count', 'style'];
var fieldDataPropertiesDictionary = { 'name': 'FieldName', 'tooltip': 'Tooltip', 'initialvalue': 'InitialValue', 'href': 'Href', 'outFieldId': 'OutFieldId', 'read-only': 'ReadOnly', 'tabindex': 'TabIndex', 'grouping': 'IsGroup', 'select-title': 'SelectTitle', 'selectfield-source': 'SelectFieldSource', 'select-prefixed-source': 'SelectPrefixedSource', 'required': 'Required', 'pattern': 'Pattern', 'minimumlength': 'MinimumLength', 'maxlength': 'MaxLength', 'min': 'Min', 'max': 'Max', 'min-selected': 'MinSelected', 'data-equals': 'DataEquals', 'current-date': 'UseCurrentDate', 'rangedate-min': 'RangeDateMin', 'rangedate-min-current': 'RangeDateMinUseCurrent', 'rangedate-max': 'RangeDateMax', 'rangedate-max-current': 'RangeDateMaxUseCurrent', 'validation-count': 'CustomValidationCount', 'dependency-count': 'DependencyCount', 'style': 'Style' };
var customValidationMetadataDictionary = { 'valErrorMessage': 'customValidationMessage-', 'valFunction': 'customValidationFunction-' };
var dependencyMetadataDictionary = { 'depName': 'name-dependency-', 'depValue': 'value-dependency-', 'depType': 'type-dependency-', 'depPremade': 'premade-type-', 'depProperty': 'property-target-', 'depPropertyValue': 'property-value-', 'depPropertyOtherwise': 'property-otherwise-', 'depEvalOtherwise': 'property-eval-otherwise-', 'depFunction': 'function-type-' };

var regularValidationErrors = false;
var checkboxOptionVerification = false;

var fieldsDataStructure = {};
var fieldObservers = new Object();
var changedFields = new Object();

var isOldIE = isOldVersionIE();

var FIELD_CONTAINER = 'div.field',
    INNER_FIELDS = 'canvas, input, select, textarea, label, a',
    TEXT_INPUT = 'input[type=text]',
    PASSWORD_INPUT = 'input[type=password]',
    EMAIL_INPUT = 'input[type=email]',
    NUMBER_INPUT = 'input[type=number]',
    RADIO_INPUT = 'input[type=radio]',
    CHECKBOX_INPUT = 'input[type=checkbox]',
    DATEPICKER_INPUT = 'input[type=datepicker]',
    CHECKBOX_GROUPING_INPUT = 'input[type=checkbox][grouping=checked]',
    CHECKED_INPUT = 'input:checked',
    NOT_CHECKED_INPUT = 'input:not(:checked)',
    TEXT_PASS_EMAIL_NUMBER_SELECT_INPUTS = 'input[type=text], input[type=password], input[type=email], input[type=number], select',
    CHECKBOX_RADIO_INPUTS = 'input[type=checkbox], input[type=radio]',
    RADIO_GROUP_CONTAINER = FIELD_CONTAINER + '.radio-group',
    CHECKBOX_GROUP_CONTAINER = FIELD_CONTAINER + '.checkbox-group',
    DEP_TYPE_PREMADE = 'premade',
    DEP_TYPE_MANUAL = 'manual',
    DEP_TYPE_FUNCTION = 'function',
    DEP_FIELD_ID = 'name-dependency-',
    DEP_VALUE = 'value-dependency-',
    DEP_TYPE = 'type-dependency-',
    DEP_PROPERTY = 'property-target-',
    DEP_FUNCTION = 'function-type-',
    DEP_PROPERTY_VALUE = 'property-value-',
    DEP_PROPERTY_OTHERWISE = 'property-otherwise-',
    DEP_EVALAUTE_OTHERWISE = 'property-eval-otherwise-',
    DEP_EVALUATE_EVAL = 'evaluate',
    DEP_EVALUATE_NOTHING = 'nothing',
    DEP_CSS_PROP_PREFIX = 'css-',
    VAL_ERROR_MESSAGE = 'customValidationMessage-',
    VAL_FUNCTION = 'customValidationFunction-',
    DATA_CUSTOM_VALIDATION_DATA = 'CustomValidationData',
    DATA_DEPENDENCY_DATA = 'DependencyData',
    DATA_DEPENDENCY_COUNT = 'dependency-count',
    DATA_FIELD_TYPE = 'FieldType',
    DATA_NAME = 'name',
    DATA_TOOLTIP = 'tooltip',
    DATA_OUT_FIELD_ID = 'outFieldId',
    DATA_READ_ONLY = 'read-only',
    DATA_GROUPING = 'grouping',
    DATA_REQUIRED = 'required',
    DATA_MIN_SELECTED = 'min-selected',
    DATA_CURRENT_DATE = 'current-date',
    DATA_MIN_DATE_CURRENT = 'rangedate-min-current',
    DATA_MAX_DATE_CURRENT = 'rangedate-max-current',
    DATA_STYLE = 'style',
    DATA_STYLE_VALUE = 'value',
    DATA_VALIDATION_COUNT = 'validation-count',
    ERROR_FIELD_CLASS = 'errorField',
    ERROR_SECTION = '#formErrors',
    MAX_ERRORS = 20,
    INITIAL_VALUE_ATTR = 'initialvalue',
    OUTFIELD_ID_ATTR = 'outfieldid',
    CHECKBOX_GROUPING_ATTR = 'grouping',
    PREMADE_SELECT_FIELDS = 'select[selectfield-source="premadefixed"]',
    PREFIXED_SOURCE_ID_ATTR = 'select-prefixed-source',
    GET_COMBO_VALUES_URL = '../ComboValues/GetListViaJson?comboId=',
    DATE_FORMAT = 'mm/dd/yy',
    SIGNATURE_PAD_CLASS = 'sigPad',
    SIGNATURE_INNER_INPUT = 'input[type=hidden].output',
    DATA_SIGNATURE_PAD = 'signaturePad',
    TOOLTIP_OPACITY = 1.0;



/** Returns the defined array of metadata properties **/
function getMetadataProperties() {
    return fieldDataProperties;
}


/** We defined the function startsWith for the String type, which returns true if 
    the string starts with the sub-string passed as a parameter and false otherwise **/
if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (str) {
        return this.slice(0, str.length) == str;
    };
}


/** Since we have different plugins and type of fields, this function returns the
    corresponding field's type based on the classes or the actual input type **/
function getType(field) {
    var input;

    // sometimes we use this function on the field's container for simplicity
    // in those cases we have to select the inner input/select/label/canvas
    if (!field.is('canvas, input, select, option, textarea, label, a'))
        input = field.find('canvas, input:first, select, textarea, label, a').first();
    else input = field;

    //.ttw-range and .ttw-date are hacks b/c chrome is currently stripping the type attribute from these fields!
    if (input.is('.ttw-range'))
        return 'range';
    else if (input.is('.ttw-date'))
        return 'date';
    else if (input.is('input'))
        return input.html5type();
    else if (input.is('select, option'))
        return 'select';
    else if (input.is('textarea'))
        return 'textarea';
    else if (input.is('label'))
        return 'label';
    else if (input.is('canvas'))
        return 'canvas';
    else if (input.is('a'))
        return 'link';
    else
        return '';
    //            return (input.is('input')) ? input.html5type() : (input.is('select, option')) ? 'select' : (input.is('textarea')) ? 'textarea' : 
    //                (input.is('label') ? 'label' : '');
}


/** This is a wrapper version of the outerHTML function.
    Some browsers don't support it, so we construct the element ourselves when needed **/
function outerHTML(node) {
    // if IE, Chrome take the internal method otherwise build one
    return node.outerHTML || (
      function (n) {
          var div = document.createElement('div'), h;
          div.appendChild(n.cloneNode(true));
          h = div.innerHTML;
          div = null;
          return h;
      })(node);
}


/** Given a Data object and a target field, sets the corresponding html attributes and data properties **/
function setHtmlMetadata(dataObject, targetField) {
    targetField = $(targetField);
    $.each(fieldDataProperties, function (index, key) {
        // jQuery.camelCase("some-string") returns "someString"  - jQuery.data() uses this notation
        var dataValue = dataObject[jQuery.camelCase(key)];
        if (dataValue !== undefined && dataValue !== null) {
            var type = dataObject[DATA_FIELD_TYPE];
            if (key === DATA_GROUPING || key === DATA_REQUIRED || key === DATA_CURRENT_DATE || key === DATA_MIN_DATE_CURRENT || key === DATA_MAX_DATE_CURRENT) {
                if (dataValue === 'checked') {
                    if (key === DATA_REQUIRED) {
                        // required attribute for checkbox group and radio group will go on the parent div since default html5 required behavior validates each individual field rather than the group
                        // required attribute for signature also goes on the parent div for manual validation
                        if (type === 'checkbox' || type === 'radio' || type === 'canvas')
                            targetField.addClass('required');
                        else
                            targetField.find('input, select').attr('required', 'required');
                    } else {
                        targetField.find('input, select, label').attr(key, dataValue);
                    }
                }
            }
            else if (key === DATA_READ_ONLY) {
                if (dataValue === 'checked') {
                    targetField.find('input').attr('readonly', 'readonly');
                }
            }
            else if (key === DATA_MIN_SELECTED || key === DATA_TOOLTIP) {
                targetField.attr(key, dataValue);
            }
            else if (key === DATA_STYLE) {
                $.each(dataValue, function (key, value) {
                    if (type === 'checkbox' || type === 'radio' || (type === 'canvas' && key === 'display')) {
                        targetField.css(key, value[DATA_STYLE_VALUE]);
                    }
                    else {
                        // handle IE8 bug on transparent backgrounds
                        if (isOldIE && (key === 'background' || key === 'background-color') && value[DATA_STYLE_VALUE].toLowerCase() === 'transparent') {
                            targetField.find('input, select, canvas, label, a').css('background-color', 'transparent').css('background-image', 'url(\'../images/transparent.gif\')');
                        } else {
                            targetField.find('input, select, canvas, label, a').css(key, value[DATA_STYLE_VALUE]);
                        }
                    }
                });
            }
            else {
                targetField.find('input, select, label, a').attr(key, dataValue);
            }
        }
    });

    /** Sets the corresponding custom validation metadata on the field's data object **/
    processCustomValidationMetadataToFields(dataObject, targetField);
    /** Sets the corresponding dependency metadata on the field's data object **/
    processDependencyMetadataToFields(dataObject, targetField);
}


/** Given a loaded dataObject and a field, process and save the
    corresponding custom validation metadata on the field's data object **/
function processCustomValidationMetadataToFields(dataObject, currentField) {
    // jQuery.camelCase("some-string") returns "someString"  - jQuery.data() uses this notation
    var valCount = dataObject[jQuery.camelCase(DATA_VALIDATION_COUNT)],
        validationData = jQuery.parseJSON(dataObject[DATA_CUSTOM_VALIDATION_DATA]);

    // loop through every custom validation, making it available on the field's data object
    if (valCount !== undefined) {
        for (var i = 1; i <= valCount; i++) {

            // loop through each validation property, saving it when there's a value on the dataObject
            for (var key in customValidationMetadataDictionary) {
                var value = validationData[i - 1][key];
                if (value !== undefined && value !== null) {
                    currentField.data()[jQuery.camelCase(customValidationMetadataDictionary[key] + i)] = htmlDecode(value);
                }
            }

        }
        // make the validation count available on the field's data
        if (currentField.data() !== undefined && currentField.data() !== null)
            currentField.data()[jQuery.camelCase(DATA_VALIDATION_COUNT)] = valCount;
    }
}

/** Given a loaded dataObject and a field, process and save the
    corresponding dependency metadata on the field's data object **/
function processDependencyMetadataToFields(dataObject, currentField) {
    // jQuery.camelCase("some-string") returns "someString"  - jQuery.data() uses this notation
    var depCount = dataObject[jQuery.camelCase(DATA_DEPENDENCY_COUNT)],
        dependencyData = jQuery.parseJSON(dataObject[DATA_DEPENDENCY_DATA]);

    // loop through every defined dependency, making it available on the field's data object
    if (depCount !== undefined) {
        for (var i = 1; i <= depCount; i++) {

            // loop through each dependency property, saving it when there's a value on the dataObject
            for (var key in dependencyMetadataDictionary) {
                var value = dependencyData[i - 1][key];
                if (value !== undefined && value !== null) {
                    currentField.data()[jQuery.camelCase(dependencyMetadataDictionary[key] + i)] = htmlDecode(value);
                }
            }

        }
        // make the dependency count available on the field's data
        if (currentField.data() !== undefined && currentField.data() !== null)
            currentField.data()[jQuery.camelCase(DATA_DEPENDENCY_COUNT)] = depCount;
    }
}


/** Load the values from the server for the select fields that
    were configured using the 'premade fixed' option as the source **/
function loadPremadeValuesForSelectFields(pageSection) {
    $(pageSection).find(PREMADE_SELECT_FIELDS).each(function () {
        var selectListControl = $(this),
            idToLoad = selectListControl.attr(PREFIXED_SOURCE_ID_ATTR);

        // clear any previous value
        selectListControl.find('option').remove();

        // get the values from the server
        var data = [];
        $.ajax({
            url: getFullyQualifiedURL(GET_COMBO_VALUES_URL + idToLoad),
            dataType: 'json',
            data: null,
            async: false,
            success: function (data) {
                // add each of the returned values as an option for the select field
                data = $.map(data, function (item, a) {
                    return '<option value=\"' + item.Value + '\">' + item.Text + '</option>';
                });
                selectListControl.append(data.join(''));
            }
        });

    });
}


/**  Setup the more common settings - styles, tooltips, dates, signatures  **/
function setPageCommonSettings(pageSection) {

    // setup tooltips plugin
    pageSection.find(FIELD_CONTAINER + '[tooltip]').each(function () {
        var tooltipOpacity = TOOLTIP_OPACITY;
        if (isFieldHidden($(this)))
            tooltipOpacity = 0.0;
        $(this).attr("title", $(this).attr('tooltip')).tooltip({ opacity: tooltipOpacity, effect: 'fade' });
    });

    // fill date field with current date or initial value, when required
    pageSection.find(DATEPICKER_INPUT).each(function () {
        // get the minimum date, if any
        var minDate, maxDate;
        if ($(this).attr('rangedate-min-current') !== undefined && $(this).attr('rangedate-min-current') === 'checked') {
            minDate = new Date();
        } else {
            minDate = $(this).attr('rangedate-min') !== undefined && $(this).attr('rangedate-min') !== '' ? $.datepicker.parseDate(DATE_FORMAT, $(this).attr('rangedate-min')) : '';
        }

        // get the maximum date, if any
        if ($(this).attr('rangedate-max-current') !== undefined && $(this).attr('rangedate-max-current') === 'checked') {
            maxDate = new Date();
        } else {
            maxDate = $(this).attr('rangedate-max') !== undefined && $(this).attr('rangedate-max') !== '' ? $.datepicker.parseDate(DATE_FORMAT, $(this).attr('rangedate-max')) : '';
        }

        // setup date picker plugin
        $(this).datepicker({
            dateFormat: DATE_FORMAT,
            changeMonth: true,
            changeYear: true,
            showButtonPanel: true,
            showOtherMonths: true,
            selectOtherMonths: true,
            yearRange: '-150:+10',
            minDate: minDate,
            maxDate: maxDate,
            onSelect: function (dateText, inst) {
                // raise a change event to notify the validation plugin
                $(this).trigger('change');
            }
        });

        // set the corresponding date, when the document was previously submitted
        if ($(this).attr('value') !== undefined && $(this).attr('value') !== '' && !isNaN(Date.parse($(this).attr('value')))) {
            $(this).datepicker("setDate", new Date(Date.parse($(this).attr('value'))));
        } else {
            // if the current-date option was set, use today date. Or use the initial value, if it was set
            if ($(this).attr('current-date') !== undefined && $(this).attr('current-date') === 'checked') {
                $(this).datepicker("setDate", getLocalDateTimeNow());
            }
        }

        // disabled the datepicker in those cases were the user selected the readonly option - also changed by dependencies
        if ($(this).attr('readonly') !== undefined && $(this).attr('readonly') !== '') {
            $(this).datepicker('disable').removeAttr('disabled');
        }
    });

    // add and empty first value for select fields, as a title
    // the value used is the one defined on the designer
    pageSection.find('select').each(function () {
        var id = $(this).attr('id') + '-0';
        var emptyOption = '<option id=\"' + id + '\" value=\"\">' + $(this).attr('select-title') + '</option>';
        $(this).prepend(emptyOption).find('option:first').attr('selected', true);
    });

    // Make checkboxes read-only, by canceling the propagation
    pageSection.find(CHECKBOX_INPUT + '[readonly]').attr('onclick', 'javascript: return false;');

    // Make checkboxes behave as a group when specified
    pageSection.find(CHECKBOX_GROUPING_INPUT).click(function () {

        if ($(this).attr('readonly') === undefined) {
            var groupName = $(this).attr('name');
            var group = CHECKBOX_GROUPING_INPUT + "[name='" + groupName + "']";
            var isThisCurrent = $(this).is(':checked');

            // first uncheck all checkboxes
            pageSection.find(group).attr("checked", false).parent().removeClass('checked');
            // then select the one clicked (this) if its not the current one
            if (isThisCurrent) {
                $(this).attr("checked", true).parent().addClass('checked');
            }

            // add all diferent containers to the changedFields to exec possible deps
            var $thisContainerId = $(this).parents(FIELD_CONTAINER).attr('id');
            pageSection.find(group).parents(FIELD_CONTAINER).each(function () {
                var id = $(this).attr('id');
                if (id !== $thisContainerId && changedFields[id] === undefined) {
                    changedFields[id] = 1;
                }
            });

            // setup a timeout for when a grouping is splited into various fields
            setTimeout(execDepForChangedFields, 100);
        }
    });

    // Make radio selection to fire a change event on the non selected radios, to trigger the associated dependencies
    pageSection.find(RADIO_INPUT).bind('change', function () {
        var groupName = $(this).attr('name');
        var group = RADIO_INPUT + "[name='" + groupName + "']";

        // add all diferent containers to the changedFields to exec possible deps
        var $thisContainerId = $(this).parents(FIELD_CONTAINER).attr('id');
        pageSection.find(group).parents(FIELD_CONTAINER).each(function () {
            var id = $(this).attr('id');
            if (id !== $thisContainerId && changedFields[id] === undefined) {
                changedFields[id] = 1;
            }
        });

        // setup a timeout for when a grouping is splited into various fields
        setTimeout(execDepForChangedFields, 100);
    });

    // setup signature pad plugin
    pageSection.find(FIELD_CONTAINER + '.' + SIGNATURE_PAD_CLASS).each(function () {
        var padWidth = $(this).css('width').replace('px', ''),
            padHeight = $(this).css('height').replace('px', '');

        // the canvas width and height need to be as attributes
        $(this).find('canvas').attr('width', padWidth);
        $(this).find('canvas').attr('height', padHeight);

        // raise a change event when drawing, to notify the validation plugin
        $(this).find('canvas').click(function () {
            $(this).next('input').trigger('change');
        });

        // obtain the value before the plugin is applied, because is overridden
        var outputFieldValue = $(this).find(SIGNATURE_INNER_INPUT).attr('value');
        // apply the signature pad plugin
        $(this).data(DATA_SIGNATURE_PAD, $(this).signaturePad({
            defaultAction: 'drawIt',    // to use the draw function as default
            drawOnly: true,             // to only allow the draw function
            lineTop: -2,                // to hide line that the plugin draws on the canvas
            validateFields: false       // we use our own validation plugin and custom function on this
        }));

        // regenerate the signature when it was submitted
        if (outputFieldValue !== undefined && outputFieldValue !== '') {
            $(this).data(DATA_SIGNATURE_PAD).regenerate(outputFieldValue);
        }
    });
}

/** Setup the initial values **/
function prepareInitialValues(pageSection, mergeFieldValuesDictionary) {
    // replace initial values with the current example values
    var fieldContainers = pageSection.find(FIELD_CONTAINER);
    for (var key in mergeFieldValuesDictionary) {
        var regex = new RegExp("\\[" + key + "\\]", "ig");
        fieldContainers.find('input, select, label, a').each(function () {
            if ($(this).attr(INITIAL_VALUE_ATTR) !== undefined && $(this).attr(INITIAL_VALUE_ATTR) !== '') {
                $(this).attr(INITIAL_VALUE_ATTR, $(this).attr(INITIAL_VALUE_ATTR).replace(regex, mergeFieldValuesDictionary[key]));
            }
        });
    }

    // remove initial values that didn't match any merge field value
    var guidRegex = new RegExp("\\[[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\\]", "ig");
    fieldContainers.find('input, select, label, a').each(function () {
        if ($(this).attr(INITIAL_VALUE_ATTR) !== undefined && $(this).attr(INITIAL_VALUE_ATTR) !== '') {
            $(this).attr(INITIAL_VALUE_ATTR, $(this).attr(INITIAL_VALUE_ATTR).replace(guidRegex, ''));
        }
    });

    // set the values for labels and links
    fieldContainers.find('label, a').each(function () {
        if ($(this).attr(INITIAL_VALUE_ATTR) !== undefined && $(this).attr(INITIAL_VALUE_ATTR) !== '') {
            $(this).html($(this).attr(INITIAL_VALUE_ATTR));
        }
    });
}

/** Set the initial values **/
function setInitialValues(pageSection) {
    var fieldContainers = pageSection.find(FIELD_CONTAINER);
    fieldContainers.find(TEXT_PASS_EMAIL_NUMBER_SELECT_INPUTS).each(function () {
        if ($(this).attr(INITIAL_VALUE_ATTR) !== undefined && $(this).attr(INITIAL_VALUE_ATTR) !== '') {
            $(this).val($(this).attr(INITIAL_VALUE_ATTR));
        }
    });
    fieldContainers.find(DATEPICKER_INPUT).each(function () {
        if ($(this).attr(INITIAL_VALUE_ATTR) !== undefined && $(this).attr(INITIAL_VALUE_ATTR) !== '') {
            var strDate = $(this).attr(INITIAL_VALUE_ATTR).replace(/\-/ig, '/').split('T')[0].split('.')[0];
            var initialDate = Date.parse(strDate);
            if (!isNaN(initialDate)) {
                $(this).datepicker("setDate", new Date(initialDate));
            }
        }
    });
    fieldContainers.find(RADIO_INPUT).each(function () {
        if ($(this).attr(INITIAL_VALUE_ATTR) !== undefined && $(this).attr(INITIAL_VALUE_ATTR) !== '' && $(this).attr(INITIAL_VALUE_ATTR) === $(this).val()) {
            $(this).attr('checked', 'checked');
            $(this).parent().addClass('checked');
        }
    });
    fieldContainers.find(CHECKBOX_INPUT).each(function () {
        if ($(this).attr(INITIAL_VALUE_ATTR) !== undefined && $(this).attr(INITIAL_VALUE_ATTR) !== '') {
            var initialValues = $(this).attr(INITIAL_VALUE_ATTR).split(',');
            for (var i = 0; i < initialValues.length; i++) {
                if (initialValues[i] === $(this).val()) {
                    $(this).attr('checked', 'checked');
                    $(this).parent().addClass('checked');
                }
            }
        }
    });
}

/** Enable dependency validation settings and run it once **/
function setPageDependencies(pageSection) {

    // loop through each of the fields seting up the auxiliar dependency structures
    pageSection.find(FIELD_CONTAINER).each(function () {
        var fieldContainerId = $(this).attr('id');
        // obtain the dependency count
        var depCount = $(this).data(DATA_DEPENDENCY_COUNT);
        if (depCount === undefined) {
            depCount = 0;
        }

        // set each of the defined dependencies for this field when correctly defined
        for (var i = 1; i <= depCount; i++) {
            // obtain the stored dependency data
            var depFieldId = $(this).data(DEP_FIELD_ID + i),
                depValue = $(this).data(DEP_VALUE + i),
                depType = $(this).data(DEP_TYPE + i),
                depProperty = $(this).data(DEP_PROPERTY + i),
                depFunction = $(this).data(DEP_FUNCTION + i);

            // if dependency is defined
            if (depFieldId !== undefined && depFieldId !== '' &&
                depValue !== undefined && depValue !== '' &&
                depType !== undefined && depType !== '' &&
                (depProperty !== undefined && depProperty !== '' || depType === DEP_TYPE_FUNCTION && depFunction !== undefined && depFunction !== '')) {

                // check that the depField is correct
                if (fieldsDataStructure[depFieldId] !== undefined) {
                    var depField = fieldsDataStructure[depFieldId].container;

                    // add the depField to the list of fields with dependencies
                    if (fieldObservers[depFieldId] === undefined) {
                        // create a new JS Object if it's not defined yet
                        fieldObservers[depFieldId] = new Object();
                    }
                    // add this field's container as a 'dependency observer' of the depField
                    if (fieldObservers[depFieldId][fieldContainerId] === undefined) {
                        fieldObservers[depFieldId][fieldContainerId] = new Object();
                    }

                    // add the dependency number for this depField as a key
                    var depFieldType = fieldsDataStructure[depFieldId].type;
                    if (depFieldType === 'checkbox' || depFieldType === 'radio') {
                        fieldObservers[depFieldId][fieldContainerId][i] = new Object();
                        fieldObservers[depFieldId][fieldContainerId][i].expression = depValue;
                        fieldObservers[depFieldId][fieldContainerId][i].values = new Object();
                        fieldsDataStructure[depFieldId].innerFields.each(function () {
                            var inputVal = $(this).val();
                            if (depValue.match(inputVal)) {
                                fieldObservers[depFieldId][fieldContainerId][i].values[inputVal] = 1;
                            }
                        });
                    } else {
                        fieldObservers[depFieldId][fieldContainerId][i] = 1;
                    }


                    // add the depField to trigger this field dependency
                    changedFields[depFieldId] = 1;
                }
            }
        }
    });

    // execute initial dependencies
    execDepForChangedFields();

    // setup field's change event handler to execute deps
    for (depFieldId in fieldObservers) {
        if (fieldsDataStructure[depFieldId] !== undefined) {
            // find named field and bind 'change' event handler
            fieldsDataStructure[depFieldId].innerFields.filter('input, select, label, a').bind('change textchange', execDepOnFieldChange);
        }
    }
}

function execDepOnFieldChange() {
    // find the field's container ID
    var depFieldId = $(this).parents(FIELD_CONTAINER).attr('id');
    if (changedFields[depFieldId] === undefined) {
        // add it to the list of changed fields
        if (fieldsDataStructure[depFieldId].type === 'checkbox' && $(this).attr(CHECKBOX_GROUPING_ATTR) === undefined) {
            if (changedFields[depFieldId] === undefined) {
                changedFields[depFieldId] = new Object();
            }
            changedFields[depFieldId][$(this).val()] = 1;
        } else {
            changedFields[depFieldId] = 1;
        }
        // delay the execution of the dependencies for checkboxes that insert the same group ID for every input
        setTimeout(execDepForChangedFields, 100);
    }
}

function execDepForChangedFields() {
    // Execute the dependencies while there is still fields on the list of changedFields
    while (Object.keys(changedFields).length > 0) {
        for (fieldId in changedFields) {
            var changedValue = changedFields[fieldId];

            // remove it from the list
            delete changedFields[fieldId];

            // check whether other fields depend on this one to execute the dep
            if (fieldObservers[fieldId] !== undefined) {
                // loop through every observer
                for (observerId in fieldObservers[fieldId]) {

                    // if it is a normal checkbox field (changedValue is an Object)
                    if (changedValue !== 1) {
                        // only execute the deps that depend on the selected/deselected values
                        for (depNumber in fieldObservers[fieldId][observerId]) {
                            var execute = false;
                            for (value in changedValue) {
                                if (($.inArray(fieldObservers[fieldId][observerId][depNumber].expression, ['.', '^$', '^$|.', '.|^$']) != -1) || fieldObservers[fieldId][observerId][depNumber].values[value] !== undefined) {
                                    execute = true;
                                }
                            }
                            if (execute) {
                                // execute the dep
                                executeDependencyForField(fieldId, observerId, depNumber);
                            }
                        }
                    } else {
                        for (depNumber in fieldObservers[fieldId][observerId]) {
                            // execute the dep
                            executeDependencyForField(fieldId, observerId, depNumber);
                        }
                    }

                }
            }


        }
    }
}

function executeDependencyForField(fieldId, observerId, depNumber) {

    // Define the execution function
    function executeDependency(matched) {
        // reset the target Field on each iteration
        targetField = fieldsDataStructure[observerId].container;
        var depEvalOtherwise = targetField.data(DEP_EVALAUTE_OTHERWISE + depNumber);

        // perform the corresponding action based on the type of dependency
        if ((depType === DEP_TYPE_PREMADE || depType === DEP_TYPE_MANUAL) && (matched || depEvalOtherwise === undefined || depEvalOtherwise === DEP_EVALUATE_EVAL)) {
            var propertyValue;

            if (matched) {
                // use the property value
                propertyValue = targetField.data(DEP_PROPERTY_VALUE + depNumber);
            } else {
                // use the otherwise value
                propertyValue = targetField.data(DEP_PROPERTY_OTHERWISE + depNumber);
            }

            // find the inner field in the cases needed
            if (targetFieldType !== 'checkbox' && targetFieldType !== 'radio' && targetFieldType !== 'canvas') {
                targetField = fieldsDataStructure[observerId].innerFields.first();
            }

            // determine the type of property to change
            if (depProperty.startsWith(DEP_CSS_PROP_PREFIX)) {
                // CSS type property
                var targetProperty = depProperty.replace(DEP_CSS_PROP_PREFIX, '');
                if (propertyValue !== undefined) {
                    // handle IE8 bug on transparent backgrounds
                    if (isOldIE && (targetProperty === 'background' || targetProperty === 'background-color') && propertyValue.toLowerCase() === 'transparent') {
                        targetField.css('background-color', 'transparent').css('background-image', 'url(\'../images/transparent.gif\')');
                    }
                    else {
                        targetField.css(targetProperty, propertyValue);
                    }
                } else {
                    if (isOldIE) {
                        targetField.removeInlineStyle(targetProperty);
                    } else {
                        targetField.css(targetProperty, '');
                    }
                }
            } else {
                // input type property

                // required attribute for checkbox group and radio group will go on the parent div since default html5 required behavior validates each individual field rather than the group
                // required attribute for signature also goes on the parent div for manual validation
                if ((targetFieldType === 'checkbox' || targetFieldType === 'radio' || targetFieldType === 'canvas') && depProperty === 'required') {
                    if (propertyValue === 'required') {
                        targetField.addClass('required');
                    } else {
                        targetField.removeClass('required');
                    }
                }
                else if ((targetFieldType === 'checkbox' || targetFieldType === 'radio') && depProperty === 'value') {
                    // set the corresponding value for checkboxes and radio buttons
                    if (propertyValue !== undefined) {
                        // raise a click event on the corresponding input
                        var selectedInput = fieldsDataStructure[observerId].innerFields.filter(NOT_CHECKED_INPUT + '[value="' + propertyValue + '"]');
                        if (selectedInput.length > 0) {
                            selectedInput.trigger('click');
                        }
                    } else {
                        // deselect all the inputs
                        fieldsDataStructure[observerId].innerFields.filter(CHECKED_INPUT).each(function () {
                            $(this).attr("checked", false).parent().removeClass('checked');
                            $(this).trigger('change');
                        });
                    }
                }
                else if ((targetFieldType === 'checkbox' || targetFieldType === 'radio') && (depProperty === 'readonly' || depProperty === 'disabled')) {
                    if (propertyValue !== undefined && propertyValue !== '') {
                        fieldsDataStructure[observerId].innerFields.attr(depProperty, propertyValue);
                        if (depProperty === 'readonly') {
                            // Make checkboxes/radio buttons read-only, by canceling the propagation
                            fieldsDataStructure[observerId].innerFields.attr('onclick', 'javascript: setTimeout(function(){$.uniform.update();}, 1); return false;');
                        }
                    } else {
                        fieldsDataStructure[observerId].innerFields.removeAttr(depProperty);
                        if (depProperty === 'readonly') {
                            fieldsDataStructure[observerId].innerFields.removeAttr('onclick');
                        }
                    }
                }
                else {
                    targetField.removeAttr(depProperty);
                    if (propertyValue !== undefined && propertyValue !== '') {
                        targetField.attr(depProperty, propertyValue);
                    }
                    // avoid recursive calls
                    if (depProperty === 'value' && fieldId !== observerId) {
                        changedFields[observerId] = 1;
                    }
                }

                // if the affected field is a date field, and the property is 'readonly'
                if (targetFieldType === 'date' && depProperty === 'readonly') {
                    // enable/disable the datepicker in those cases were readonly attribute was changed
                    if (targetField.attr('readonly') !== undefined && targetField.attr('readonly') !== '') {
                        targetField.datepicker('disable');
                    } else {
                        targetField.datepicker('enable');
                    }
                }
            }
        }
        else if (depType === DEP_TYPE_FUNCTION) {
            // find the inner field to make the value assignment

            try {
                // evaluate the provided function using the following snippet
                // the depFunction should follow the JavaScript's function definition syntax
                jQuery.globalEval('var IO = ' + depFunction.replace('\n', '') + '; var result = IO();');

                // set the field value with the result
                if (result !== undefined) {
                    if (targetFieldType !== 'checkbox' && targetFieldType !== 'radio') {

                        // avoid recursive calls
                        if (fieldId !== observerId) {
                            changedFields[observerId] = 1;
                        }

                        // find the inner field to make the value assignment
                        targetField = fieldsDataStructure[observerId].innerFields.filter('input, select, label, a');

                        // date fields need to be set via the date picker
                        if (targetFieldType === 'date' && !isNaN(Date.parse(result))) {
                            targetField.datepicker('setDate', result);
                        }
                        else {
                            targetField.val(result);
                        }
                    } else {
                        // set the corresponding value for checkboxes and radio buttons
                        if (result !== '') {
                            // raise a click event on the corresponding input
                            var selectedInput = fieldsDataStructure[observerId].innerFields.filter(NOT_CHECKED_INPUT + '[value="' + result + '"]');
                            if (selectedInput.length > 0) {
                                selectedInput.trigger('click');
                            }
                        } else {
                            // deselect all the inputs
                            fieldsDataStructure[observerId].innerFields.filter(CHECKED_INPUT).each(function () {
                                $(this).attr("checked", false).parent().removeClass('checked');
                                $(this).trigger('change');
                            });
                        }
                    }
                }
            } catch (error) {
                targetField = fieldsDataStructure[observerId].innerFields.filter('input, select, label, a').first();
                var msj = "There was an error executing a dependency of type Function.<br />";
                msj += "Field's name: " + targetField.attr('name') + ".<br />";
                msj += "Error message: " + error.message;

                showAlert(msj);
            }

        }
    }

    var depField = fieldsDataStructure[fieldId].container,
        fieldType = fieldsDataStructure[fieldId].type,
        targetField = fieldsDataStructure[observerId].container,
        targetFieldType = fieldsDataStructure[observerId].type;

    var depValue = targetField.data(DEP_VALUE + depNumber),
        depType = targetField.data(DEP_TYPE + depNumber),
        depProperty = targetField.data(DEP_PROPERTY + depNumber),
        depFunction = targetField.data(DEP_FUNCTION + depNumber);

    // for checkboxes/radio we need to evaluate the expression based on the current values
    if (fieldType === 'checkbox' || fieldType === 'radio') {
        var firstInput = fieldsDataStructure[fieldId].innerFields.first();
        var isGrouping = fieldType === 'checkbox' && firstInput.is(CHECKBOX_GROUPING_INPUT);

        // check if there are any options selected
        var anySelected = fieldsDataStructure[fieldId].innerFields.filter('input:checked').length > 0;
        if (isGrouping) {
            var groupName = firstInput.attr('name');
            var group = CHECKBOX_GROUPING_INPUT + "[name='" + groupName + "']";
            anySelected = $documentSection.find(group + ':checked').length > 0;
        }

        // replace the any/empty regex on the expression
        var expression = depValue;
        var myregexp = new RegExp('\\.', 'g');
        expression = expression.replace(myregexp, anySelected);
        myregexp = new RegExp('\\^\\$', 'g');
        expression = expression.replace(myregexp, !anySelected);

        // replace with the needed values
        for (value in fieldObservers[fieldId][observerId][depNumber].values) {
            var myregexp = new RegExp(value, 'g');
            if (isGrouping) {
                var groupName = firstInput.attr('name');
                var group = CHECKBOX_GROUPING_INPUT + "[name='" + groupName + "']";
                expression = expression.replace(myregexp, $documentSection.find(group + '[value="' + value + '"]').is(':checked'));
            } else {
                expression = expression.replace(myregexp, fieldsDataStructure[fieldId].innerFields.filter('input[value="' + value + '"]').is(':checked'));
            }
        }
        // try to eval the expression
        try {
            var evaluation = eval(expression);
            if (evaluation === 1 || evaluation === true) {
                executeDependency(true);
            } else if (depType !== DEP_TYPE_FUNCTION) {
                executeDependency(false);
            }
        } catch (error) {
            // Notify the user of the incorrect expression
            var msj = "There was an error evaluating an expression for a dependency.<br />";
            msj += "Please confirm that the values assigned for evaluation are valid.<br />";
            msj += "Field's name: " + firstInput.attr('name') + ".<br />";
            msj += "Error message: " + error.message;

            showAlert(msj);
        }
    } else {
        var innerField = fieldsDataStructure[fieldId].innerFields;
        if (((fieldType === 'label' || fieldType === 'link') && innerField.html().match(depValue)) || (innerField.val().match(depValue))) {
            executeDependency(true);
        } else if (depType !== DEP_TYPE_FUNCTION) {
            executeDependency(false);
        }
    }

    // Enable/disable the tooltip based on the display property of the field
    targetField = fieldsDataStructure[observerId].container;
    if (targetField.data()[DATA_TOOLTIP] !== undefined) {
        if (isFieldHidden(targetField)) {
            targetField.data()[DATA_TOOLTIP].getConf().opacity = 0.0;
        } else {
            targetField.data()[DATA_TOOLTIP].getConf().opacity = TOOLTIP_OPACITY;
        }
    }

}




/** Enable checkbox to run the validation when a change event is raised **/
function setCheckboxChangeEventHandler(pageSection, errorSection, fieldValidationSuccess) {
    pageSection.find(CHECKBOX_INPUT).bind('change', function () {
        // clear any previous error messages and styles displayed
        clearCheckboxError($(this), pageSection, errorSection, fieldValidationSuccess);
        // remove the checked attribute when it corresponds
        if (!$(this).is(CHECKED_INPUT)) {
            $(this).removeAttr('checked');
        }
    });
}


/** Setup all the validations required to the current page **/
function setPageValidationSettings(pageSection, action, fieldValidationSuccess) {

    // unbind any old submit event handler
    pageSection.unbind('submit');

    // install a new instance of the validator
    pageSection.validator({
        lang: $('meta').attr('content').slice(0, 2),        // this is loaded on the razor as a HTML helper
        effect: 'customErrors',                             // the custom effect error defined on each page
        container: ERROR_SECTION,                           // the section where the errors will appear
        inputEvent: 'change'                                // to trigger the validation immediately
    }).bind("onSuccess", fieldValidationSuccess);

    // control the submit event, run validation, and execute the passed action on success
    pageSection.submit(function (e) {

        // scroll to top of the page
        $('html, body').animate({ scrollTop: 0 }, 'slow');

        //run check/radio group validation
        var form = $(this);
        var checkRadioValidation = validateCheckRadio(form);

        // if normal validation is passed
        if (!e.isDefaultPrevented() && checkRadioValidation) {
            // perform the specified action, using the corresponding form
            action(form);
        }
        return false;
    });
}

function registerCustomValidations(pageSection) {
    // loop through each of the fields deleting any previous validation
    pageSection.find(FIELD_CONTAINER).each(function () {
        // obtain the validation count
        var valCount = $(this).data(DATA_VALIDATION_COUNT);

        if (valCount !== undefined && valCount > 0) {
            // TODO: checkboxes y radio buttons - canvas
            var fieldIdMatcher = '#' + $(this).find('input, select').first().attr('id');
            $.tools.validator.deleteAllMatching(fieldIdMatcher);

            // setup the validation plugin to use the custom validation
            $.tools.validator.fn(fieldIdMatcher, handleCustomValidation);
        }
    });


    function handleCustomValidation(el, value) {
        // obtain the field container
        var container = $(el).parents(FIELD_CONTAINER);

        // obtain the validation count
        var valCount = container.data(DATA_VALIDATION_COUNT);

        var i = 1,
            isValid = true,
            errorMessage = '';

        while (isValid && i <= valCount) {
            // obtain the stored validation function
            var validationFunction = container.data(VAL_FUNCTION + i);

            if (validationFunction !== undefined && validationFunction !== '') {
                // make the element and object available for the custom validation function
                jQuery.globalEval('var auxElement, auxValue;');
                window.auxElement = el;
                window.auxValue = value;
                jQuery.globalEval('var IO = ' + validationFunction.replace('\n', '') + '; var result = IO(window.auxElement, window.auxValue);');

                // check the results
                if (result === false) {
                    isValid = false;
                    errorMessage = container.data(VAL_ERROR_MESSAGE + i);
                } else if (result.substring) { // check whether the result is a string message
                    isValid = false;
                    errorMessage = result;
                }
            }
            
            i++;
        }

        // check exit condition
        if (isValid)
            return true;

        return (errorMessage !== undefined ? errorMessage : "Please correct this value");
    }
}




/** Clear any checkbox errors when a change event is raised **/
function clearCheckboxError(input, pageSection, errorSection, fieldValidationSuccess) {
    // check whether we are displaying the errors to the user
    if (errorSection.css('display') === 'block') {
        // remove the error class from the field's container
        input.parents(FIELD_CONTAINER).removeClass(ERROR_FIELD_CLASS);
        // run the validation again to update the displayed errors, if any
        checkNextError(pageSection, errorSection, fieldValidationSuccess);
    }
}

/** Checks for the next error to indicate to the user **/
function checkNextError(pageSection, errorSection, fieldValidationSuccess) {
    // check whether we are displaying the errors to the user
    if (errorSection.css('display') === 'block') {
        var validator = pageSection.data("validator");
        // unbind the onSuccess event to prevent entering into a loop
        pageSection.unbind("onSuccess");
        // run the validation functions
        validator.checkValidity();
        validateCheckRadio(pageSection);
        // rebind the onSuccess event handler
        pageSection.bind("onSuccess", fieldValidationSuccess);
    }
}

/** Validate checkbox and radio groups **/
function validateCheckRadio(pageForm) {
    var err = {};

    // check whether required group fields have at least one option selected
    pageForm.find(RADIO_GROUP_CONTAINER + ', ' + CHECKBOX_GROUP_CONTAINER).each(function () {
        if ($(this).hasClass('required')) {
            var type = getType($(this));
            var name = $(this).find('input:first').attr('name');
            if (!pageForm.find('input[type="' + type + '"][name="' + name + '"]:checked').length)
                err[name] = 'Please complete this mandatory field.';
        }
    });

    // check whether checkbox groups have the minimum of options selected when specified
    pageForm.find(CHECKBOX_GROUP_CONTAINER).each(function () {
        var min = $(this).attr('min-selected');
        if (min !== undefined && min !== '' && min !== '0') {
            var disabled = $(this).find('input:first').attr('disabled');
            if (disabled == undefined) {
                var name = $(this).find('input:first').attr('name');
                if (pageForm.find(CHECKBOX_INPUT + '[name="' + name + '"]:checked').length < min) {
                    err[name] = 'Please select at least ' + min + ' option' + (min > 1 ? 's' : '');
                }
            }
        }
    });

    // if there were any errors, invalidate the fields and display the messages using the custom effect
    if (!$.isEmptyObject(err)) {
        var validator = pageForm.data('validator');
        // set aux variable to true, to indicate we are passing checkbox/option errors to the validator custom effect
        checkboxOptionVerification = true;
        validator.invalidate(err);
        checkboxOptionVerification = false;
        return false
    }
    else return true;
}


/** Define dependency validation function **/
function dependencyValidation() {


    // Define the execution function
    function executeDependency(index, depType, matched) {
        // reset the target Field on each iteration
        targetField = $documentSection.find('#' + key);

        var depProperty = targetField.data(DEP_PROPERTY + index);
        var depFunction = targetField.data(DEP_FUNCTION + index);
        var depEvalOtherwise = targetField.data(DEP_EVALAUTE_OTHERWISE + index);

        // perform the corresponding action based on the type of dependency
        if ((depType === DEP_TYPE_PREMADE || depType === DEP_TYPE_MANUAL) && (matched || depEvalOtherwise === undefined || depEvalOtherwise === DEP_EVALUATE_EVAL)) {
            var propertyValue;

            if (matched) {
                // use the property value
                propertyValue = targetField.data(DEP_PROPERTY_VALUE + index);
            } else {
                // use the otherwise value
                propertyValue = targetField.data(DEP_PROPERTY_OTHERWISE + index);
            }

            // find the inner field in the cases needed
            if (targetFieldType !== 'checkbox' && targetFieldType !== 'radio' && targetFieldType !== 'canvas') {
                targetField = targetField.find('input, select, label, a').first();
            }

            // determine the type of property to change
            if (depProperty.startsWith(DEP_CSS_PROP_PREFIX)) {
                // CSS type property
                if (propertyValue !== undefined) {
                    targetField.css(depProperty.replace(DEP_CSS_PROP_PREFIX, ''), propertyValue);
                } else {
                    targetField.css(depProperty.replace(DEP_CSS_PROP_PREFIX, ''), '');
                }
            } else {
                // input type property

                // required attribute for checkbox group and radio group will go on the parent div since default html5 required behavior validates each individual field rather than the group
                // required attribute for signature also goes on the parent div for manual validation
                if ((targetField.is('div') || targetField.is('canvas')) && depProperty === 'required') {
                    if (propertyValue === 'required') {
                        targetField.addClass('required');
                    } else {
                        targetField.removeClass('required');
                    }
                }
                else if ((targetField.is('div')) && depProperty === 'value') {
                    // set the corresponding value for checkboxes and radio buttons
                    if (propertyValue !== undefined) {
                        // raise a click event on the corresponding input
                        targetField.find(NOT_CHECKED_INPUT).each(function () {
                            if ($(this).val() === propertyValue) {
                                $(this).trigger('click');
                            }
                        });
                    } else {
                        // deselect all the inputs
                        targetField.find(CHECKED_INPUT).each(function () {
                            $(this).attr("checked", false).parent().removeClass('checked');
                            $(this).trigger('change');
                        });
                    }
                }
                else if ((targetField.is('div')) && (depProperty === 'readonly' || depProperty === 'disabled')) {
                    if (propertyValue !== undefined && propertyValue !== '') {
                        targetField.find(CHECKBOX_RADIO_INPUTS).attr(depProperty, propertyValue);
                        if (depProperty === 'readonly') {
                            // Make checkboxes/radio buttons read-only, by canceling the propagation
                            targetField.find(CHECKBOX_RADIO_INPUTS).attr('onclick', 'javascript: setTimeout(function(){$.uniform.update();}, 1); return false;');
                        }
                    } else {
                        targetField.find(CHECKBOX_RADIO_INPUTS).removeAttr(depProperty);
                        if (depProperty === 'readonly') {
                            targetField.find(CHECKBOX_RADIO_INPUTS).removeAttr('onclick');
                        }
                    }
                }
                else {
                    targetField.removeAttr(depProperty);
                    if (propertyValue !== undefined && propertyValue !== '') {
                        targetField.attr(depProperty, propertyValue);
                    }
                    if (depProperty === 'value') {
                        targetField.trigger('change');
                    }
                }

                // if the affected field is a date field, and the property is 'readonly'
                if (targetFieldType === 'date' && depProperty === 'readonly') {
                    // enable/disable the datepicker in those cases were readonly attribute was changed
                    if (targetField.attr('readonly') !== undefined && targetField.attr('readonly') !== '') {
                        targetField.datepicker('disable');
                    } else {
                        targetField.datepicker('enable');
                    }
                }
            }
        }
        else if (depType === DEP_TYPE_FUNCTION) {
            // find the inner field to make the value assignment

            try {
                // evaluate the provided function using the following snippet
                // the depFunction should follow the JavaScript's function definition syntax
                jQuery.globalEval('var IO = ' + depFunction.replace('\n', '') + '; var result = IO();');

                // set the field value with the result
                if (result !== undefined) {
                    if (targetFieldType !== 'checkbox' && targetFieldType !== 'radio') {

                        // find the inner field to make the value assignment
                        targetField = targetField.find('input, select, label, a');

                        // date fields need to be set via the date picker
                        if (targetFieldType === 'date' && !isNaN(Date.parse(result))) {
                            targetField.datepicker('setDate', result);
                        }
                        else {
                            targetField.val(result);
                            targetField.trigger('change');
                        }
                    } else {
                        // set the corresponding value for checkboxes and radio buttons
                        if (result !== '') {
                            // raise a click event on the corresponding input
                            targetField.find(NOT_CHECKED_INPUT).each(function () {
                                if ($(this).val() === result) {
                                    $(this).trigger('click');
                                }
                            });
                        } else {
                            // deselect all the inputs
                            targetField.find(CHECKED_INPUT).each(function () {
                                $(this).attr("checked", false).parent().removeClass('checked');
                                $(this).trigger('change');
                            });
                        }
                    }
                }
            } catch (error) {
                targetField = targetField.find('input, select, label, a');
                var msj = "There was an error executing a dependency of type Function.<br />";
                msj += "Field's name: " + targetField.attr('name') + ".<br />";
                msj += "Error message: " + error.message;

                showAlert(msj);
            }

        }
    }


    var depField = $(this),
        fieldType = getType(depField),
        fieldContainer = depField.parents(FIELD_CONTAINER),
        fieldId = fieldContainer.attr('id');

    // make the defined action for each dependency subscriber
    for (var key in fieldContainer.data().dependencyObservers) {

        var targetField = $documentSection.find('#' + key),
            targetFieldType = getType(targetField),
            depCount = targetField.data(DATA_DEPENDENCY_COUNT);

        if (depCount === undefined) {
            depCount = 0;
        }

        // filter the valid ones - those dependencies that are well defined, and that depend on this field
        // split the valid dependencies into two collection, the ones that match the expected value and the once that dont
        var matchDependencies = new Object();
        var unmatchDependencies = new Object();
        for (var i = 1; i <= depCount; i++) {

            // check that depends on this field
            var depFieldId = targetField.data(DEP_FIELD_ID + i);
            if (depFieldId !== undefined && depFieldId !== '' && depFieldId === fieldId) {

                var depValue = targetField.data(DEP_VALUE + i),
                    depType = targetField.data(DEP_TYPE + i),
                    depProperty = targetField.data(DEP_PROPERTY + i),
                    depFunction = targetField.data(DEP_FUNCTION + i);

                // if dependency is defined
                if (depValue !== undefined && depValue !== '' &&
                    depType !== undefined && depType !== '' &&
                    (depProperty !== undefined && depProperty !== '' || depType === DEP_TYPE_FUNCTION && depFunction !== undefined && depFunction !== '')) {

                    var isCheckboxGroup = depField.is(CHECKBOX_GROUPING_INPUT);

                    // in the case of checkboxes we need to the check that the value is the same as the specified
                    // or that the checkbox is behaving as a group, which works as a radio input
                    if (fieldType !== 'checkbox' && fieldType !== 'radio' || depField.val().match(depValue)) {


                        // check whether the value matches or not, based on the type of dependency
                        if (depType === DEP_TYPE_PREMADE || depType === DEP_TYPE_MANUAL) {

                            // check whether its' a checkbox that is not in a group and checked, or if the value match the expected for the every type of field
                            if ((fieldType === 'checkbox' && depField.is(CHECKED_INPUT)) ||
                                ((fieldType === 'label' || fieldType === 'link') && depField.html().match(depValue)) ||
                                (fieldType === 'radio' && depField.is(CHECKED_INPUT)) ||
                                (fieldType !== 'checkbox' && fieldType !== 'radio' && depField.val().match(depValue))) {

                                // add the dependency to the matched ones
                                matchDependencies[i] = depType;
                            }
                            else {
                                // add the dependency to the unmatched ones
                                unmatchDependencies[i] = depType;
                            }
                        }
                            // check if it matches for the function type
                        else if (depType === DEP_TYPE_FUNCTION) {
                            if (depField.val().match(depValue)) {

                                matchDependencies[i] = depType;
                            }
                        }
                    }
                }
            }
        }

        // Run the unmatched dependencies first
        for (var depIndex in unmatchDependencies) {
            executeDependency(depIndex, unmatchDependencies[depIndex], false);
        }
        // Run the matched dependencies after
        for (var depIndex in matchDependencies) {
            executeDependency(depIndex, matchDependencies[depIndex], true);
        }

        // Enable/disable the tooltip based on the display property of the field
        targetField = $documentSection.find('#' + key);
        if (targetField.data()[DATA_TOOLTIP] !== undefined) {
            if (isFieldHidden(targetField)) {
                targetField.data()[DATA_TOOLTIP].getConf().opacity = 0.0;
            } else {
                targetField.data()[DATA_TOOLTIP].getConf().opacity = TOOLTIP_OPACITY;
            }
        }


    }   // for each observer
}


/** This functions handle the error messages expand/collapse actions **/
function showAllErrors() {
    $(this).unbind('click');
    var wall = $(this).parent(ERROR_SECTION);
    wall.find('p').css('display', 'block');
    wall.find('div').remove();
    wall.append("<div style=\"float: right; position: relative;top: -10px; color:darkred; cursor:pointer; \">" + localizationStrings['ShowLessErrors'] + "&#9650;</div>");
    wall.find('div').bind('click', showLessErrors);
}
function showLessErrors() {
    $(this).unbind('click');
    var wall = $(this).parent(ERROR_SECTION);

    var errorMessages = wall.find('p');
    errorMessages.css('display', 'none').eq(0).css('display', 'block');
    wall.find('div').remove();
    wall.append("<div style=\"float: right; position: relative;top: -10px; color:darkred; cursor:pointer; \">" + localizationStrings['ShowMoreErrors'] + "&#9660;</div>");
    wall.find('div').bind('click', showAllErrors);
}



/** Transform the metadata from the fields, to conform the format used in the model **/
function transformMetadataToSend(metadata) {

    // loop through each of the field's containers 
    for (var field = 0; field < metadata.length; field++) {
        var dataObject = metadata[field];

        // transform the field type into it's integer representation
        // the numbers correspond to the model's FieldType enumeration values
        switch (dataObject[DATA_FIELD_TYPE]) {
            case "text":
                dataObject[DATA_FIELD_TYPE] = 1;
                break;
            case "password":
                dataObject[DATA_FIELD_TYPE] = 2;
                break;
            case "number":
                dataObject[DATA_FIELD_TYPE] = 3;
                break;
            case "email":
                dataObject[DATA_FIELD_TYPE] = 4;
                break;
            case "date":
                dataObject[DATA_FIELD_TYPE] = 5;
                break;
            case "radio":
                dataObject[DATA_FIELD_TYPE] = 7;
                break;
            case "checkbox":
                dataObject[DATA_FIELD_TYPE] = 8;
                break;
            case "select":
                dataObject[DATA_FIELD_TYPE] = 9;
                break;
            case "label":
                dataObject[DATA_FIELD_TYPE] = 10;
                break;
            case "canvas":
                dataObject[DATA_FIELD_TYPE] = 11;
                break;
            case "link":
                dataObject[DATA_FIELD_TYPE] = 12;
                break;
        }

        // iterate over the metadata properties
        for (key in fieldDataPropertiesDictionary) {
            // jQuery.camelCase("some-string") returns "someString"  - jQuery.data() uses this notation
            var camelCaseKey = jQuery.camelCase(key),
            dataValue = dataObject[camelCaseKey];

            // transform data from checkbox options into Boolean values when needed
            if (key === DATA_READ_ONLY || key === DATA_GROUPING || key === DATA_REQUIRED || key === DATA_CURRENT_DATE || key === DATA_MIN_DATE_CURRENT || key === DATA_MAX_DATE_CURRENT) {
                if (dataValue === 'checked') {
                    dataValue = true;
                } else {
                    dataValue = false;
                }
            }
                // transform data from style into string
            else if (key === DATA_STYLE) {
                dataValue = JSON.stringify(dataValue);
            }

            if (dataValue !== undefined && dataValue !== null) {
                // add the new Key
                dataObject[fieldDataPropertiesDictionary[key]] = dataValue;
            }

            // remove the old key-value pair
            delete dataObject[camelCaseKey];
        }

    }
}

/** Transform the metadata received from the server, to conform the format used in the model **/
function transformMetadataToFieldsData(metadata) {
    for (var field = 0; field < metadata.length; field++) {
        var dataObject = metadata[field];

        // transform the field type into a string representation, from the model's FieldType enumeration
        // the string representations are the same as the strings returned from the getType function
        switch (dataObject[DATA_FIELD_TYPE]) {
            case 1:
                dataObject[DATA_FIELD_TYPE] = "text";
                break;
            case 2:
                dataObject[DATA_FIELD_TYPE] = "password";
                break;
            case 3:
                dataObject[DATA_FIELD_TYPE] = "number";
                break;
            case 4:
                dataObject[DATA_FIELD_TYPE] = "email";
                break;
            case 5:
                dataObject[DATA_FIELD_TYPE] = "date";
                break;
            case 7:
                dataObject[DATA_FIELD_TYPE] = "radio";
                break;
            case 8:
                dataObject[DATA_FIELD_TYPE] = "checkbox";
                break;
            case 9:
                dataObject[DATA_FIELD_TYPE] = "select";
                break;
            case 10:
                dataObject[DATA_FIELD_TYPE] = "label";
                break;
            case 11:
                dataObject[DATA_FIELD_TYPE] = "canvas";
                break;
            case 12:
                dataObject[DATA_FIELD_TYPE] = "link";
                break;
        }

        // iterate over the metadata properties
        for (key in fieldDataPropertiesDictionary) {
            // jQuery.camelCase("some-string") returns "someString"  - jQuery.data() uses this notation
            var camelCaseKey = jQuery.camelCase(key),
            dataValue = dataObject[fieldDataPropertiesDictionary[key]];

            // transform data from Boolean values into the checkbox representation when needed
            if (key === DATA_READ_ONLY || key === DATA_GROUPING || key === DATA_REQUIRED || key === DATA_CURRENT_DATE || key === DATA_MIN_DATE_CURRENT || key === DATA_MAX_DATE_CURRENT) {
                if (dataValue === true) {
                    dataValue = 'checked';
                    // add the new Key
                    dataObject[camelCaseKey] = dataValue;
                }
                // remove the old key
                delete dataObject[fieldDataPropertiesDictionary[key]];
            }
            else if (dataValue !== null && dataValue !== undefined) {

                // transform style string into an JS Object
                if (key === DATA_STYLE) {
                    dataValue = JSON.parse(dataValue);
                }

                // add the new Key
                dataObject[camelCaseKey] = dataValue;

                // remove the old key-value pair
                delete dataObject[fieldDataPropertiesDictionary[key]];
            }
        }

    }

}

/** Returns wheter the field is been displayed or hidden **/
function isFieldHidden(fieldContainer) {
    var type = fieldsDataStructure[fieldContainer.attr('id')].type;

    if (type === 'checkbox' || type === 'radio' || type === 'canvas') {
        return fieldContainer.css('display') === 'none';
    } else {
        return fieldsDataStructure[fieldContainer.attr('id')].innerFields.first().css('display') === 'none';
    }
}

/** Modal alert dialogs **/
function showAlert(alert, width) {
    if (width === undefined)
        width = 'auto';

    $('<div>' + alert + '</div>').dialog({
        resizable: false,
        title: 'Alert',
        modal: true,
        width: width,
        buttons: {
            Ok: function () {
                $(this).dialog("close");
            }
        }
    });
}


function htmlEncode(value) {
    if (value) {
        return jQuery('<div />').text(value).html();
    } else {
        return '';
    }
}
function htmlDecode(value) {
    if (value) {
        return $('<div />').html(value).text();
    } else {
        return '';
    }
}


/* Returns an array of a given object's own enumerable properties, in the same order as that provided by a for-in loop (the difference being that a for-in loop enumerates properties in the prototype chain as well). */
/* To add compatible Object.keys support in older environments that do not natively support it, copy the following snippet: */
if (!Object.keys) {
    Object.keys = (function () {
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
            dontEnums = [
              'toString',
              'toLocaleString',
              'valueOf',
              'hasOwnProperty',
              'isPrototypeOf',
              'propertyIsEnumerable',
              'constructor'
            ],
            dontEnumsLength = dontEnums.length

        return function (obj) {
            if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object')

            var result = []

            for (var prop in obj) {
                if (hasOwnProperty.call(obj, prop)) result.push(prop)
            }

            if (hasDontEnumBug) {
                for (var i = 0; i < dontEnumsLength; i++) {
                    if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i])
                }
            }
            return result
        }
    })()
};

function isOldVersionIE() {
    return ($.browser.msie && parseInt($.browser.version, 10) < 9);
}

(function ($) {
    $.fn.removeInlineStyle = function (style) {
        var search = new RegExp(style + '[^;]+;?', 'g');

        return this.each(function () {
            $(this).attr('style', function (i, style) {
                return style.replace(search, '');
            });
        });
    };
})(jQuery);
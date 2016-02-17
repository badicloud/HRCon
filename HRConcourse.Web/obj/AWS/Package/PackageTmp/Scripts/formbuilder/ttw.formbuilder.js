/// <reference path="jquery-1.7.1.js"/>
/// <reference path="jquery-ui-1.8.9.custom.min.js"/>
/// <reference path="jquery.tools.js"/>
/// <reference path="validationSetup.js"/>
/// <reference path="formsCommon.js"/>
/// <reference path="formDesignerCodes.js"/>

/* Global variables definitions */
var $loadingIndicator, $fieldSettings, $mainSettings, $validationSettings, $dependencySettings, $styleSettings, $inputSettings,
    $formElements, $formTemplates, $inputSettingsTmpl, $customValTemplate, $customValSection, $dependencyTemplate, $dependencySection, $toolbox, $alignTopAction, $alignLeftAction,
    $workArea, $formBuilder, $formDesigner, $formImage, $previewSection, $formDesignerState,
    $clickedContainerField, upperElementClick = false,
    $jsEditor,
    $addInitialValueDialog, $initialValueSetting, $outFieldSelectNames, 
    $rangedateMinInput, $rangedateMaxInput,
    $headerTitle, $previewButton, $testSubmitButton,
    $errorSection, $confirmDialog, $notification,
    fieldsMetadata, notificationTimeout, useUniform = true,
    $documentSection, // needed for the dependency function in common.js
    depTypeSectionIds = { 'premade': 'dep-premade-type-', 'manual': 'dep-manual-type-', 'function': 'dep-function-type-' };
    premadeDependencyActions = {
        'hideField': { displayName: 'Hide this field', targetProperty: 'css-display', actionValue: 'none', otherwiseValue: 'block' },
        'requireField': { displayName: 'Make this field required', targetProperty: 'required', actionValue: 'required', otherwiseValue: '' },
        'readonlyField': { displayName: 'Make this field readonly', targetProperty: 'readonly', actionValue: 'readony', otherwiseValue: '' }
    },

    FORM_ELEMENT_TEMPLATES_URL = '../Content/formbuilder/form_elements.html';
    FORM_ELEMENT_TEMPLATES_ID = 'form-elements-tmpl';
    FORM_PREVIEW_ID = 'form-preview',
    JAVASCRIPT_WARNING_ID = 'javascript-warning',
    PREVIEW_MODE_CLASS = 'preview-mode',
    SELECTED_FIELD_CLASS = 'selectedField',
    MESSAGE_CLASS = 'message';
    INDESIGN_SUBMIT_NOTIFICATION = 'Use preview mode to test form';
    VALIDATION_SUCCESS_NOTIFICATION = 'Validation passed';
    DELETE_FIELD_CLASS = 'delete-field';
    ADD_OPTION_ID = 'add-option-value';
    REMOVE_OPTION_CLASS = 'remove-option';
    DEFAULT_CONFIRM_ACTION_TITLE = 'Confirm';
    DELETE_FIELD_ACTION_TITLE = 'Delete Field';
    REMOVE_CUSTOM_VALIDATION_TITLE = 'Remove Custom Validation';
    REMOVE_DEPENDENCY_TITLE = 'Remove Dependency';
    CLEAR_IMAGE_TITLE = 'Reset Image';
    ALIGN_TOP_ACTION_ID = 'align-top';
    ALIGN_BOTTOM_ACTION_ID = 'align-bottom';
    ALIGN_LEFT_ACTION_ID = 'align-left';
    ALIGN_RIGHT_ACTION_ID = 'align-right';
    DUPLICATE_FIELD_ACTION_ID = 'duplicate-field';
    ADD_INITIAL_VALUE_ID = 'add-initial-value';
    ADD_CUSTOM_VAL_ID = 'add-new-custom-val';
    ADD_DEPENDENCY_ID = 'add-new-dependency';
    DELETE_CUSTOM_VAL_CLASS = 'delete-validation';
    DELETE_DEPENDENCY_CLASS = 'delete-dependency';
    VAL_SETTING_PREFIX = 'custom-val-sett-';
    VAL_SETTING_CLASS = 'custom-val-setting';
    VAL_COLLAPSABLE_SECTIONS = '.expand-collapse-validation, .settingName';
    VAL_HEADER_CLASS = 'custom-val-header';
    DEP_SETTING_PREFIX = 'dep-sett-';
    DEP_PREMADE_PREFIX = 'dep-premade-type-';
    DEP_SETTING_CLASS = 'dependency-setting';
    DEP_COLLAPSABLE_SECTIONS = '.expand-collapse-dependency, .settingName';
    DEP_HEADER_CLASS = 'dep-header';
    STYLE_COLLAPSABLE_SECTIONS = '.expand-collapse-style, .settingName';
    STYLE_HEADER_CLASS = 'style-header';
    STYLE_SETTING_CLASS = 'style-settings-section';
    STYLE_SHORTHAND_CLASS = 'style-shorthand';
    SETTING_CONTENT_CLASS = 'setting-content';
    SETTING_COLLAPSED_CLASS = 'collapsed';
    CHECK_RADIO_CONTAINER_DISTANCE = 8;


    $(function () {

        //get rid of the javascript warning
        var workspace = document.getElementById(FORM_PREVIEW_ID),
            jsWarning = document.getElementById(JAVASCRIPT_WARNING_ID);
        workspace.removeChild(jsWarning);

        //Pseudo stop if this is old ie.
        if ($.support.leadingWhitespace === false)
            ieNotice('This app only works in modern browsers.');

        // global variables initialization
        $loadingIndicator = $('#loading-indicator');
        $fieldSettings = $('#fieldProperties');
        $mainSettings = $fieldSettings.find('#main-settings');
        $validationSettings = $fieldSettings.find('#validation-settings');
        $dependencySettings = $fieldSettings.find('#dependency-settings');
        $styleSettings = $fieldSettings.find('#style-settings');
        $inputSettings = $fieldSettings.find('#input-settings');
        $formElements = $('#form-elements');
        $inputSettingsTmpl = $('#input-settings-tmpl');
        $customValTemplate = $('#validation-tmpl');
        $customValSection = $('#custom-val-section');
        $dependencyTemplate = $('#dependency-tmpl');
        $dependencySection = $('#dependency-section');
        $toolbox = $('#toolbox');
        $workArea = $('#work-area');
        $formBuilder = $('#form-builder');
        $formDesigner = $('#form-preview');
        $previewSection = $('#preview-section');
        $formDesignerState = new designerState();
        $formImage = $("#form-image");
        $headerTitle = $('#headerTitle');
        $previewButton = $('#previewBttn');
        $testSubmitButton = $('#testSubmitBttn');
        $addInitialValueDialog = $('#add-initial-value-action');
        $initialValueSetting = $('#main-initialvalue');
        $outFieldSelectNames = $('#main-outFieldId select');
        $rangedateMinInput = $('#min-date-manual');
        $rangedateMaxInput = $('#max-date-manual');
        $errorSection = $(ERROR_SECTION);
        $confirmDialog = $('#confirm-action');
        $notification = $('#notification');
        $documentSection = $('#preview-section');
        $jsEditor = $('#jsEditor');

        // display loading indicator
        loadingIndicator();

        // make field settings became tabs
        $fieldSettings.tabs();
        // apply jScrollPane plugin to the setting sections
        $mainSettings.jScrollPane().find('.jspPane').resize(function (e) {
            $mainSettings.jScrollPane();
        });
        $validationSettings.jScrollPane().find('.jspPane').resize(function (e) {
            $validationSettings.jScrollPane();
        });
        $dependencySettings.jScrollPane().find('.jspPane').resize(function (e) {
            $dependencySettings.jScrollPane();
        });
        $styleSettings.jScrollPane().find('.jspPane').resize(function (e) {
            $styleSettings.jScrollPane();
        });

        // Update the 'dep-name-dependency-X' combobox when the Dependency tab is selected
        $fieldSettings.bind("tabsselect", function (event, ui) {
            // if the dependency tab is the selected one
            if (ui.index === 2 && $clickedContainerField !== undefined) {
                var depCount = $clickedContainerField.data(DATA_DEPENDENCY_COUNT);
                // if there are any dependencies defined
                if (depCount !== undefined && depCount !== 0) {
                    // loop through them, adding the corresponding settings
                    for (var i = 1; i <= depCount; i++) {
                        //Load comboBox Dependencies field name and set it based on the current selected control
                        manageDependencyFieldName(i);
                    }
                }
            }
        });

        // make the style sections collapsible
        $styleSettings.find('.' + SETTING_CONTENT_CLASS).hide();
        $styleSettings.find(STYLE_COLLAPSABLE_SECTIONS).parents('.' + STYLE_SETTING_CLASS).addClass(SETTING_COLLAPSED_CLASS);
        $styleSettings.find(STYLE_COLLAPSABLE_SECTIONS).click(function () {
            $(this).parent('.' + STYLE_HEADER_CLASS).nextAll('.' + SETTING_CONTENT_CLASS).slideToggle(500);
            $(this).parents('.' + STYLE_SETTING_CLASS).toggleClass(SETTING_COLLAPSED_CLASS);
        });

        // hide the field settings section - will be displayed when a field is added/selected
        hideProperties();

        // setup datepicker plugin for any date field on the settings sections
        $(DATEPICKER_INPUT).datepicker({
            dateFormat: DATE_FORMAT,
            changeMonth: true,
            changeYear: true,
            showButtonPanel: true,
            showOtherMonths: true,
            selectOtherMonths: true,
            yearRange: '-150:+10'
        });

        // setup the javascript editor
        $jsEditor.data('editor', CodeMirror.fromTextArea($('#jsEditor textarea')[0]));

        // load application resources
        loadAppResources();

        // setup general validation settings
        setupValidation(); // validationSetup.js

        // register custom validation effect to jquery validation plug-in
        registerValidationEffect();

        // allow the selected field to be repositioned using the arrow keys
        //            $(document).keydown(function (e) {
        //                $div = $clickedContainerField;
        //                switch (e.which) {
        //                    case 37:
        //                        $div.css('left', (parseInt($div.css('left').slice(0, $div.css('left').length - 2)) - 1) + "px");
        //                        return false;
        //                        break;
        //                    case 38:
        //                        $div.css('top', (parseInt($div.css('top').slice(0, $div.css('top').length - 2)) - 1) + "px");
        //                        return false;
        //                        break;
        //                    case 39:
        //                        $div.css('left', (parseInt($div.css('left').slice(0, $div.css('left').length - 2)) + 1) + "px");
        //                        return false;
        //                        break;
        //                    case 40:
        //                        $div.css('top', (parseInt($div.css('top').slice(0, $div.css('top').length - 2)) + 1) + "px");
        //                        return false;
        //                        break;
        //                }
        //            });

        

        // all preloading done, hide loading indicator
        loadingIndicator('remove');

        var TTWFormBuilder = function () {

            var loading_indicator = '<div class="loading-indicator">' +
                                '<div class="loading-overlay">&nbsp;</div>' +
                                '<div class="loading-content">' +
                                'Loading...' +
                                '</div>' +
                                '</div>',
            content = $('#content'),
            $currentField = $('#current-field'),
            formElements = [],
            columnWidth,
            settings = {},
            sizeClasses = 'f_25 f_50 f_75 f_100',
            sizeClassBase = 25,
            loader = {},
            cachedOption = ['', ''],

            pv,
            theme = 'aristo',

            // global variables initialization

            $controls = $('#controls');
            $actions = $('#actions');

            return {
                init: true
            }
        } (); // End of the form builder object

        //Start the form builder **/
        //TTWFormBuilder.init();
    });












/****  INITIAL SETUP FUNCTIONS  ****/

/** Add or remove the loading indicator **/
function loadingIndicator(remove, callback) {
    if (remove === 'undefined' || !remove) {
        $loadingIndicator.css('display', 'block');
    }
    else {
        $loadingIndicator.css('display', 'none');
    }
    // execute the callback when correctly provided
    if (callback !== 'undefined' && $.isFunction(callback)) {
        callback();
    }
}

/** Loads the application resources - templates, images, etc **/
function loadAppResources() {
    // Load the form elements template
    loadFormElements();
    
    // Bind all event handlers
    bindEvents();

    // Setup the fields palette's drag and drop functionality
    setupPaletteDragFields();
}

/** Load the jQuery templates from a static html **/
function loadFormElements() {
    var url = getFullyQualifiedURL(FORM_ELEMENT_TEMPLATES_URL);
    $.get(url, function (data) {
        $formElements.html(data);
        // global templates variable initialization
        $formTemplates = $('#' + FORM_ELEMENT_TEMPLATES_ID);
    });
}

/** Bind all event handlers **/
function bindEvents() {

    // preview button toggles the designer modes
    $previewButton.click(function () {
        tooglePreviewMode();
        return false;
    });

    // allows the user to test the form
    $testSubmitButton.click(function () {
        $previewSection.submit();
        return false;
    });

    // in case the user tries to submit the designer form
    $formDesigner.submit(function () {
        // notify the user to use the preview mode to test the form
        showNotification(INDESIGN_SUBMIT_NOTIFICATION);
        return false;
    });

    // bind the delete field buttons - this buttons are added for every new field
    $('.' + DELETE_FIELD_CLASS).live('click', function () {
        var field = $(this).parents(FIELD_CONTAINER);
        confirmAction(function () { removeField(field); }, DELETE_FIELD_ACTION_TITLE);
    });

    // field settings add and remove options buttons
    $('#' + ADD_OPTION_ID).click(function () {
        addFieldOption();
    });
    $('.' + REMOVE_OPTION_CLASS).live('click', function () {
        removeFieldOption($(this));
    });

    // field selection on click
    $(FIELD_CONTAINER).live('click', function (e) {
        if (! inPreviewMode()) {
            upperElementClick = true;     // the click event if fired in the parent div also
            // check whether the user is selecting multiple fields
            if (e.shiftKey) {
                selectMultipleFields(this);
            } else {
                selectField(this);
            }
        }
    });

    // field deselecting when clicked somewhere else on the document
    $workArea.live('click', function () {
        // check whether the user click on a field before, or if its clicking on an empty area
        if (upperElementClick) {
            upperElementClick = false;
        } else {
            deselectFields();
        }
    });

    // Aligns all selected fields with the highest one
    $('#' + ALIGN_TOP_ACTION_ID).click(function () {
        var selectedFields = $('.' + SELECTED_FIELD_CLASS);
        var alignment = new Alignment();
        alignment.alignTop(selectedFields);
            });

    // Aligns all selected fields with the lowest one
    $('#' + ALIGN_BOTTOM_ACTION_ID).click(function () {
        var selectedFields = $('.' + SELECTED_FIELD_CLASS);
        var alignment = new Alignment();
        alignment.alignBottom(selectedFields);
            });

    // Aligns all selected fields with the leftmost one
    $('#' + ALIGN_LEFT_ACTION_ID).click(function () {
        var selectedFields = $('.' + SELECTED_FIELD_CLASS);
        var alignment = new Alignment();
        alignment.alignLeft(selectedFields);
            });

    // Aligns all selected fields with the rightmost one
    $('#' + ALIGN_RIGHT_ACTION_ID).click(function () {
        var selectedFields = $('.' + SELECTED_FIELD_CLASS);
        var alignment = new Alignment();
        alignment.alignRight(selectedFields);
            });

    // Duplicates the selected field
    $('#' + DUPLICATE_FIELD_ACTION_ID).click(function () {
        var selectedFields = $('.' + SELECTED_FIELD_CLASS);
        if (selectedFields.length == 1) {
            var cloning = new Cloning();
            cloning.cloneField(selectedFields);
        }
    });
    
    // Add new custom validation
    $('#' + ADD_CUSTOM_VAL_ID).click(function () {
        addNewCustomValidation();
    });
    
    // Delete a custom validation
    $('.' + DELETE_CUSTOM_VAL_CLASS).live('click', function () {
        var valSetting = $(this).parents('.' + VAL_SETTING_CLASS);
        confirmAction(function () { removeCustomValidation(valSetting); }, REMOVE_CUSTOM_VALIDATION_TITLE);
    });

    // Add new dependency
    $('#' + ADD_DEPENDENCY_ID).click(function () {
        addNewDependency();
    });

    // Delete a dependency
    $('.' + DELETE_DEPENDENCY_CLASS).live('click', function () {
        var depSetting = $(this).parents('.' + DEP_SETTING_CLASS);
        confirmAction(function () { removeDependency(depSetting); }, REMOVE_DEPENDENCY_TITLE);
    });

    // Add new initial value
    $('#' + ADD_INITIAL_VALUE_ID).click(function () {
        addInitialValue();
    });
}



/** Setup the palette and document page to allow the new fields to be added using drag and drop **/
function setupPaletteDragFields() {
    // Let the palette controls be draggable
    $("#controls li").draggable({
        cancel: "a.ui-icon", // clicking an icon won't initiate dragging
        containment: $("body"), //.length ? "#demo-frame" : "document", // stick to demo-frame if present
        distance: 20,
        helper: "clone",
        revert: "invalid", // when not dropped, the item will revert back to its initial position
        zIndex: 100
    });

    // let the document area be droppable, accepting the palette controls
    $workArea.droppable({
        accept: "#controls li",
        activeClass: "droppableActive",
        drop: function (event, ui) {
            var positionLeft = parseInt(ui.offset.left) - parseInt($workArea.offset().left) - 25;
            var positionTop = parseInt(ui.offset.top) -parseInt($workArea.offset().top);
            var id = ui.draggable.attr('id');
            addField(id, positionLeft, positionTop);
        }
    });
}

/** Register the custom validation effect to show error messages **/
function registerValidationEffect() {
    // Adds an effect called "customErrors" to the validator
    $.tools.validator.addEffect("customErrors", function (errors, event) {

        // get the error messages div
        var wall = $(this.getConf().container).css('display', 'block'),
            errorIndex = 0,
            maxErrors = 0;

        // remove the previous 'show all messages' link
        wall.find("div").remove();

        // check if we can only add the new error messages or if we can also remove the previous ones
        // to do this, we are using two auxiliary variables, which are set after running the checkbox validation
        // for the first one, and after displaying the errors for the second one
        if (checkboxOptionVerification === false || regularValidationErrors === false) {
            // remove all previous error messages
            wall.find("p").remove();
            maxErrors = MAX_ERRORS;
        } else {
            // if we can't erase the previous messages, we need to know how many can we add
            maxErrors = MAX_ERRORS - wall.find('p').length;
        }

        // add the first MAX_ERRORS
        while (errorIndex < errors.length && errorIndex < maxErrors) {
            // add the error message into the wall
            wall.append("<p><strong>" + errors[errorIndex].input.attr("name") + "</strong> " + errors[errorIndex].messages[0] + "</p>");
            // increment the loop variable
            errorIndex++;
        }

        // make the error fields have the class ERROR_FIELD_CLASS
        $.each(errors, function (index, error) {
            error.input.parents(FIELD_CONTAINER).addClass(ERROR_FIELD_CLASS);
        });

        if (checkboxOptionVerification === false) {
            // set aux variable to true, to indicate that regular errors have occurred
            regularValidationErrors = true;
        } else if (regularValidationErrors === true) {
            // reset aux variable to false, to indicate that checkbox errors have been added
            regularValidationErrors = false;
        }

        // code to handle the expand/collapse error messages
        var errorMessages = wall.find('p');
        if (errorMessages.length > 1) {
            // hidde all other errors
            errorMessages.css('display', 'none').eq(0).css('display', 'block');

            //  add the div to expand/collapse the errors
            wall.append("<div style=\"float: right; position: relative;top: -10px; color:darkred; cursor:pointer; \">" + localizationStrings['ShowMoreErrors'] + "&#9660;</div>");
            wall.find('div').bind('click', showAllErrors);
        } 


    }, function (inputs) {
        // hide the error messages div
        var wall = $errorSection.css('display', 'none');
        // remove the class 'errorField' from the field
        $.each(inputs, function () {
            $(this).parents(FIELD_CONTAINER).removeClass(ERROR_FIELD_CLASS);
        });
    });
}




/**** FIELD SETTINGS DISPLAYING FUNCTIONS  ****/

/** Hides the field settings menu **/
function hideFieldSettings() {
    $fieldSettings.animate({ opacity: 0 }, 'fast', function () {
        $(this).css({ display: 'none' });
    });
}

/** Shows the field settings menu **/
function showFieldSettings() {
    $fieldSettings.animate({ opacity: 1 }, 'fast', function () {
        $(this).css({ display: 'block' });
    });
}

/** Hide the properties sections **/
function hideProperties() {
    $mainSettings.css('display', 'none');
    $validationSettings.css('display', 'none');
    $dependencySettings.css('display', 'none');
    $styleSettings.css('display', 'none');
}

/** Show the properties sections **/
function showProperties() {
    $mainSettings.css('display', '');
    $validationSettings.css('display', '');
    $dependencySettings.css('display', '');
    $styleSettings.css('display', '');
}







/****  DESIGNER BASIC FUNCTIONS  ****/

/** Add a field to the form **/
// TODO < ---- refactor this section
function addField(fieldType, positionLeft, positionTop) {
    var thisNewField,
        newFieldContainer,
        fieldId = guidGenerator().replace(/-/g, ''),
        field = {
            fieldType: fieldType,
            name: 'field' + fieldId,
            id: fieldId,
            actionsType: 'field'
        };

    // Add the field to the formu
    $formTemplates.tmpl(field).appendTo($formDesigner);

    thisNewField = $('#' + fieldId);
    newFieldContainer = $('#' + fieldId + '-container');

    // setup container data
    newFieldContainer.data(DATA_NAME, thisNewField.attr('name'));
    if (fieldType === 'radio-field' || fieldType === 'checkbox-field') {
        newFieldContainer.data(DATA_NAME, newFieldContainer.find('input:first').attr('name'));
    }
    if (fieldType !== 'checkbox-field' && fieldType !== 'label-field' && fieldType !== 'link-field') {
        newFieldContainer.data('required', 'checked');
    }

    if (fieldType === 'select-field') {
        newFieldContainer.data('select-title', '- Select a value -');
        newFieldContainer.data('selectfield-source', 'premademanual');
    }

    // If date field, setup datepicker
    if (fieldType === 'date-field')
        thisNewField.datepicker({
            dateFormat: DATE_FORMAT,
            changeMonth: true,
            changeYear: true,
            showButtonPanel: true,
            showOtherMonths: true,
            selectOtherMonths: true,
            yearRange: '-150:+10'
        });

    // Apply uniform style to checkboxes and radio buttons
    if (useUniform && (fieldType === 'checkbox-field' || fieldType === 'radio-field')) {
        newFieldContainer.find('input').uniform();
        newFieldContainer.find('input').removeAttr('style');
    }

    // Make the fields resizeable
    bindResizableToFields(newFieldContainer.animate({ opacity: 1 }, 'fast'));

    // Make the fields draggables
    newFieldContainer.draggable({ containment: $workArea });

    // Make the checkboxes and radio buttons draggables inside their container
    newFieldContainer.find('.option').draggable({ containment: 'parent', stop: function (event, ui) {
            var fields = ui.helper.parent();
            resetResizableMinHeightAndWidth(fields);
        }
    });

    // Position the field according to the dropped item's position
    newFieldContainer.css('left', positionLeft + 'px');
    newFieldContainer.css('top', positionTop + 'px');

    // Select the newly added field
    selectField(newFieldContainer);
}

/** Select a field **/
function selectField(container) {
    var $container = $(container),
        prevSelected = $clickedContainerField;

    //  deselect any previous selected field
    deselectFields();

    // apply css style to the new selected field
    $container.addClass(SELECTED_FIELD_CLASS);

    if ($('.' + SELECTED_FIELD_CLASS).length === 1) {
        $clickedContainerField = $container;

        // reset the properties sections when a new field is selected
        if (prevSelected === undefined || prevSelected.attr('id') !== $container.attr('id')) {
            resetFieldSettingsDialog($container);
        }
        showProperties();
    }
}

/** Select multiples fields **/
function selectMultipleFields(container) {
    var $container = $(container);

    // apply css style to the new selected field
    $container.addClass(SELECTED_FIELD_CLASS);
    // hide the properties section, since multiples fields are been selected
    hideProperties();
}

/** Deselect all the previously selected fields **/
function deselectFields() {
    $('.' + SELECTED_FIELD_CLASS).removeClass(SELECTED_FIELD_CLASS);
    hideProperties();
}

/** Remove a field from the form **/
function removeField(field) {
    field.fadeOut();
    field.remove();
    deselectFields();
}





/** PROPERTIES EDITION - ADD INITIAL VALUES, ADD/REMOVE DEPENDENCIES **/

/** Selects one of the initial values and adds it to the field properties **/
function addInitialValue() {

    // clear and reload the available initial values    
    var selectableValues = $addInitialValueDialog.find('select');
    selectableValues.html('');
    for (var key in mergeFieldDefinitionsDictionary) {
        selectableValues.append("<option value=\"" + mergeFieldDefinitionsDictionary[key] + "\">" + mergeFieldDefinitionsDictionary[key] + "</option>");
    }
    var filterText = $addInitialValueDialog.find('#filterTextbox');
    filterText.val('');
    selectableValues.filterByText(filterText, true);

    // show the dialog to the user
    $addInitialValueDialog.dialog({
        resizable: false,
        modal: true,
        buttons: {
            "Add value": function () {
                $(this).dialog("close");
                // if the users selects one of the initial values, insert it on the appropriate setting
                if (selectableValues.val() !== null && selectableValues.val() !== undefined) {
                    insertAtCaret($initialValueSetting.find('input')[0], "[" + selectableValues.val() + "]");
                    // a change event is needed to allow the field to be updated
                    $initialValueSetting.find('input').trigger('change');
                }
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });

}

/** Adds a new custom validation **/
function addNewCustomValidation() {
    var valCount = $clickedContainerField.data(DATA_VALIDATION_COUNT);
    if (valCount === undefined) {
        valCount = 0;
    }
    valCount += 1;

    // add a new custom validation section to the properties section
    addCustomValidationSection(valCount);

    // add the needed data - validation new count
    $clickedContainerField.data(DATA_VALIDATION_COUNT, valCount);

    // bind the change events for the fields
    var valSetting = $('#' + VAL_SETTING_PREFIX + valCount);
    bindCustomValidationFields($clickedContainerField, valSetting);

   // make the custom validation section collapsible
    valSetting.find(VAL_COLLAPSABLE_SECTIONS).click(function () {
        $(this).parent('.' + VAL_HEADER_CLASS).nextAll('.' + SETTING_CONTENT_CLASS).slideToggle(500);
        $(this).parents('.' + VAL_SETTING_CLASS).toggleClass(SETTING_COLLAPSED_CLASS);
    });
}

/** Adds a new custom validation section **/
function addCustomValidationSection(index) {
    //append to custom-val-section
    $customValTemplate.tmpl({ count: index }).appendTo($customValSection);
}

/** Removes a custom validation **/
function removeCustomValidation(valSetting) {
    var valNumber = valSetting.attr('id').slice(VAL_SETTING_PREFIX.length),
        valCount = $clickedContainerField.data(DATA_VALIDATION_COUNT);

    if (valCount !== undefined && valCount > 0) {

        // fade out the corresponding custom validation
        valSetting.fadeOut(function () {
            // remove the validation section
            $(this).remove();

            // remove all the field's properties for this validation
            $(this).find('input, textarea').each(function() {
                var id = $(this).parent().attr('id'),
                    rule = id,
                    value = $clickedContainerField.data(rule);
                if (value !== undefined) {
                    //remove the old rule
                    delete $clickedContainerField.data()[jQuery.camelCase(rule)];
                }
            });

            // update the rest to continue with the numeration
            for (var i = parseInt(valNumber) + 1; i <= valCount; i++) {
                var auxSetting = $('#' + VAL_SETTING_PREFIX + i);

                // update the id's, unbind previous handler, bind event handler for current field
                auxSetting.find('input, textarea').each(function() {
                    var id = $(this).parent().attr('id'),
                        rule = id,
                        prefix = rule.slice(0, rule.length - ("" + i).length),
                        newRule = prefix + (i - 1),
                        value;

                    value = $clickedContainerField.data(rule);
                    if (value !== undefined) {
                        //remove the old rule
                        delete $clickedContainerField.data()[jQuery.camelCase(rule)];
                        //add the new rule with the same value
                        $clickedContainerField.data(newRule, value);
                    }
                });
            }

            // decrement the custom validation count
            $clickedContainerField.data(DATA_VALIDATION_COUNT, valCount - 1);
            // reset the custom validation settings
            resetCustomValidationSettings($clickedContainerField);
        });
    }
}

/** Adds a new dependency section on the properties box **/
function addNewDependency() {
    var depCount = $clickedContainerField.data(DATA_DEPENDENCY_COUNT);
    if (depCount === undefined) {
        depCount = 0;
    }
    depCount += 1;

    // add a new dependency section to the properties section
    addDependencySection(depCount);

    // add the needed data - dependency type and new count
    $clickedContainerField.data(DEP_TYPE + depCount, DEP_TYPE_PREMADE);
    $clickedContainerField.data(DEP_EVALAUTE_OTHERWISE + depCount, DEP_EVALUATE_EVAL);
    $clickedContainerField.data(DATA_DEPENDENCY_COUNT, depCount);


    // bind the change events for the fields
    var depSetting = $('#' + DEP_SETTING_PREFIX + depCount);
    bindDependencyFields($clickedContainerField, depSetting);

    // only show the corresponding dependency type section
    showDependencyTypeSection(depCount);

    // make the dependency section collapsible
    depSetting.find(DEP_COLLAPSABLE_SECTIONS).click(function () {
        $(this).parent('.' + DEP_HEADER_CLASS).nextAll('.' + SETTING_CONTENT_CLASS).slideToggle(500);
        $(this).parents('.' + DEP_SETTING_CLASS).toggleClass(SETTING_COLLAPSED_CLASS);
    });
}

/** Adds a new dependency section, and loads the needed combo boxes **/
function addDependencySection(index) {
    //append to dependency-section
    $dependencyTemplate.tmpl({ count: index }).appendTo($dependencySection);

    // load every field's name and select the saved one, if any
    manageDependencyFieldName(index);
    // load the premade actions
    loadPremadeDependencies(index);
}

/** Removes a dependency section from the properties box **/
function removeDependency(depSetting) {
    var depNumber = depSetting.attr('id').slice(DEP_SETTING_PREFIX.length),
        depCount = $clickedContainerField.data(DATA_DEPENDENCY_COUNT);

    if (depCount !== undefined && depCount > 0) {

        // fade out the corresponding dependency
        depSetting.fadeOut(function() {
            // remove the dependency section
            $(this).remove();

            // remove all the field's properties for this dependency
            $(this).find('input, select, textarea').each(function() {
                var id = $(this).parent().attr('id'),
                    rule = id.slice(4),
                    value = $clickedContainerField.data(rule);
                if (value !== undefined) {
                    //remove the old rule
                    delete $clickedContainerField.data()[jQuery.camelCase(rule)];
                }
            });

            // update the rest to continue with the numeration
            for (var i = parseInt(depNumber) + 1; i <= depCount; i++) {
                var auxSetting = $('#' + DEP_SETTING_PREFIX + i);

                // update the id's, unbind previous handler, bind event handler for current field
                auxSetting.find('input, select, textarea').each(function() {
                    var id = $(this).parent().attr('id'),
                        rule = id.slice(4),
                        prefix = rule.slice(0, rule.length - ("" + i).length),
                        newRule = prefix + (i - 1),
                        value;

                    value = $clickedContainerField.data(rule);
                    if (value !== undefined) {
                        //remove the old rule
                        delete $clickedContainerField.data()[jQuery.camelCase(rule)];
                        //add the new rule with the same value
                        $clickedContainerField.data(newRule, value);
                    }
                });
            }

            // decrement the dependency count
            $clickedContainerField.data(DATA_DEPENDENCY_COUNT, depCount - 1);
            // reset the dependency settings menu
            resetDependencySettings($clickedContainerField);
        });
    }
}



/** ADD AND REMOVE OPTIONS FOR CHECK, RADIO AND SELECT FIELDS **/

/** This adds an element to a select field, radio group, or checkbox group **/
function addFieldOption() {
    var currentFieldId = $clickedContainerField.attr('id'),
        currentNumOptions = $clickedContainerField.find('input:last, option:last').last().attr('id'),
        fieldName = $clickedContainerField.data().name,
        fieldType = getType($clickedContainerField),
        optionsParent = (fieldType !== 'select') ? $clickedContainerField : $clickedContainerField.find('select'),
        option = {},
        newOptionNum,
        id,
        clickedContainerFieldHeight;

    // TODO: this is a workaround for the cases when the user erase all options for a radio/checkbox group
    // the type could be loaded on the metadata. Another way is to not allow the user to remove all values
    if (fieldType !== undefined && fieldType !== '') {
        // obtain the number of options from the ID of the last option
        if (currentNumOptions !== undefined) {
            currentNumOptions = parseInt(currentNumOptions.slice(currentNumOptions.indexOf('-') + 1));
        }
        else {
            currentNumOptions = 0;
        }

        newOptionNum = currentNumOptions + 1;

        // set the options to use on the template
        id = currentFieldId.slice(0, currentFieldId.indexOf('-') + 1) + newOptionNum;
        option = {
            fieldType: fieldType + '-option',
            type: fieldType,
            name: fieldName,
            id: id,
            option: 'Value ' + newOptionNum
        };

        // append the new option to its parent
        $formTemplates.tmpl(option).appendTo(optionsParent);
        // append the corresponding setting to the inputsettings sectoin
        $inputSettingsTmpl.tmpl({ id: id + '-setting' }).appendTo($inputSettings);

        // get handles to the field settings input and input/option that we just created
        var settingsInput = $('#' + id + '-setting').find('input');
        var thisInputField = $('#' + id);

        // apply the uniform plugin to the newly added option
        if (useUniform && fieldType !== 'select') {
            thisInputField.uniform();
            thisInputField.removeAttr('style');
        }

        //set the newly added field settings input to the value of the new input/option
        settingsInput.val(getInputOptionValue(thisInputField, fieldType));

        //bind text change event
        bindInputOptionToFieldSettings(settingsInput, thisInputField);

        // make newly option draggable
        $('#' + currentFieldId + ' .option').draggable({ containment: 'parent' });

        // bind the handler to reset the minimums height and width after an option is dragged
        $('#' + currentFieldId + ' .option').bind("dragstop", function (event, ui) {
            var fieldContainer = ui.helper.parent();
            resetResizableMinHeightAndWidth(fieldContainer);
        });

        // Calculate, adjust and modify the minimum height and width when necessary
        resetResizableMinHeightAndWidth(optionsParent);
        var currentMinHeight = optionsParent.resizable("option", "minHeight");
        if (optionsParent.height() < currentMinHeight)
            optionsParent.height(currentMinHeight)
        var currentMinWidth = optionsParent.resizable("option", "minWidth");
        if (optionsParent.width() < currentMinWidth)
            optionsParent.width(currentMinWidth)
    }

    //Adding option causes settings to move down, re-position them
    // positionFieldSettings();
}

/** Removes an option element from a select, radio, or checkbox group **/
function removeFieldOption(removeButton) {
    var optionSetting = removeButton.parent(),
        optionSettingId = optionSetting.attr('id'),
        inputOptionId = optionSettingId.slice(0, optionSettingId.lastIndexOf('-')),
        inputOption = $formDesigner.find('#' + inputOptionId),
        fieldContainer = inputOption.parents(FIELD_CONTAINER);

    inputOption.parents('div.option:first').stop().fadeOut(function () {
        $(this).remove();
    });

    inputOption.fadeOut(function () {
        $(this).remove();
    });

    optionSetting.fadeOut(function () {
        $(this).remove();
        // Adjust the resizable height and width
        resetResizableMinHeightAndWidth(fieldContainer);
    });

}

/** Gets the value of a specific option in a select, radio or checkbox group **/
function getInputOptionValue(thisInputField, fieldType) {
    //if (useUniform)
    return (fieldType !== 'select') ? thisInputField.attr('value') : thisInputField.html();
}

/** Binds the new option to the field settings dialog **/
function bindInputOptionToFieldSettings(settingsInput, thisInputField) {
    var typedValue;

    settingsInput.bind('textchange', function () {
        typedValue = $(this).val();
        thisInputField.attr('value', typedValue);

        // if this is a select
        if (thisInputField.is('option')) {
            // change the showed value as well
            thisInputField.html(typedValue);
        }
    });
}







// TODO < ---- refactor this section
/****  EDIT FIELD SETTINGS FUNCTIONS  ****/

/** Loads the values and binds the custom validation fields change event **/
function bindCustomValidationFields(currentField, valSetting) {
    //reset all the values to blank or attribute value on currentField, unbind previous field, bind event handler for current field
    valSetting.find('input, textarea').each(function () {
        var id = $(this).parent().attr('id'),
            rule = id,
            value,
            attributes,
            settingType;

        value = (currentField.data(rule) !== undefined) ? currentField.data(rule) : '';

        if (value !== '') {
            attributes = { 'value': value };

            //apply attributes variable
            if (attributes !== undefined) {
                $(this).attr(attributes);
            }
        }

        //unbind old events and bind current field
        $(this).unbind('change textchange')
                .bind('change textchange', function () {
                    updateCustomValidationRules(currentField, $(this), rule);
                });
    });

    // setup button for JS editor
    valSetting.find('.editFunctionButton').button();
    valSetting.find('.editFunctionButton').bind('click', { currentField: currentField, valSetting: valSetting }, showJsEditorForValidation);
}

/** Loads the values and binds the dependency fields change event **/
function bindDependencyFields(currentField, depSetting) {
    //reset all the values to blank or attribute value on currentField, unbind previous field, bind event handler for current field
    depSetting.find('input, select, textarea').each(function () {
        var id = $(this).parent().attr('id'),
                    rule = id.slice(4), // id="dep-dependencyName-X"
                    value,
                    attributes,
                    settingType;

        value = (currentField.data(rule) !== undefined) ? currentField.data(rule) : '';

        if (value !== '') {
            settingType = $(this).attr('type');
            if (settingType === 'checkbox') {
                attributes = { 'checked': value };
            }
            else if (settingType === 'radio') {
                if ($(this).val() === value)
                    attributes = { 'checked': 'checked' };
            }
            else attributes = { 'value': value };

            //apply attributes variable
            if (attributes !== undefined) {
                $(this).attr(attributes);
            }
        } else {
            if ($(this).is('input') && $(this).attr('type') === 'checkbox')
                $(this).removeAttr('checked');
        }

        //unbind old events and bind current field
        $(this).unbind('change textchange')
                        .bind('change textchange', function () {
                            updateDependencyRules(currentField, $(this), rule);
                        });
    });

    // setup button for JS editor
    depSetting.find('.editFunctionButton').button();
    depSetting.find('.editFunctionButton').bind('click', { currentField: currentField, depSetting: depSetting }, showJsEditorForDependency);
}

/** Loads every field's name and selects the saved one if any **/
function manageDependencyFieldName(index) {
    var selectListControlDepName = $('#dep-name-dependency-' + index).find('select'),
        selectedDependencyName = $clickedContainerField.data('name-dependency-' + index);

    // load every field's name
    loadDependencyFieldNames(selectListControlDepName);

    // select any saved configuration
    if (selectedDependencyName !== undefined) {
        selectListControlDepName.val(selectedDependencyName)
    }
}

/** Load all the premade dependency actions **/
function loadPremadeDependencies(index) {
    var selectListControl = $('#' + DEP_PREMADE_PREFIX + index).find('select');
    // remove any previous option
    selectListControl.find('option').remove();

    // add an option for every premade dependency action defined
    for (var key in premadeDependencyActions) {
        selectListControl.append('<option value=\"' + key + '\">' + premadeDependencyActions[key].displayName + '</option>');
    }

    selectListControl.prepend('<option value=\"\">- Select an action -</option>');
}

/** Based on the chosen type of dependency, shows the corresponding section **/
function showDependencyTypeSection(index) {
    var depType = $('#dep-type-dependency-' + index).find(CHECKED_INPUT).val();
    hideAllDependencyTypeSections(index);
    $('#' + depTypeSectionIds[depType] + index).css('display', 'block');
}

/** Hides all the different type dependency sections **/
function hideAllDependencyTypeSections(index) {
    for (var key in depTypeSectionIds) {
        $('#' + depTypeSectionIds[key] + index).css('display', 'none');
    }
}

function showJsEditorForValidation(e) {
    var rule = VAL_FUNCTION + e.data.valSetting.attr('id').slice(VAL_SETTING_PREFIX.length);
    var value = e.data.currentField.data(rule);

    $jsEditor.dialog({
        resizable: false,
        modal: true,
        width: 700,
        title: 'Edit your function',
        buttons: {
            Ok: function () {
                var value = $jsEditor.data('editor').getValue();
                e.data.valSetting.find('#' + rule + ' textarea').val(value).trigger('change');
                $(this).dialog("close");
            }
        }
    });

    if (value !== undefined) {
        $jsEditor.data('editor').setValue(value);
    } else {
        $jsEditor.data('editor').setValue("function (element, value) {\n  if (value === '1') {\n     return true;\n  }\n  return false;\n}");
    }
}

function showJsEditorForDependency(e) {
    var rule = DEP_FUNCTION + e.data.depSetting.attr('id').slice(DEP_SETTING_PREFIX.length);
    var value = e.data.currentField.data(rule);
    
    $jsEditor.dialog({
        resizable: false,
        modal: true,
        width: 700,
        title: 'Edit your function',
        buttons: {
            Ok: function () {
                var value = $jsEditor.data('editor').getValue();
                e.data.depSetting.find('#dep-function-type-' + e.data.depSetting.attr('id').slice(DEP_SETTING_PREFIX.length) + ' textarea').val(value).trigger('change');
                $(this).dialog("close");
            }
        }
    });

    if (value !== undefined) {
        $jsEditor.data('editor').setValue(value);
    } else {
        $jsEditor.data('editor').setValue("function () {\n  var res = 'value';\n  return res;\n}");
    }
}





/****  RESET FIELD SETTINGS FUNCTIONS  ****/

/** Reset the field settings dialog for the current field **/
function resetFieldSettingsDialog(currentField) {
    var thisInputField = currentField.find("input:first, option:first, select, label, a").first(),
        fieldType = getType(currentField),
        settingType;

    //make sure the first tab is selected
    $fieldSettings.tabs('select', 0);

    $inputSettings.html('');
    $inputSettings.css('display', 'none');

    // make sure the field has a style data property
    if (currentField.data(DATA_STYLE) === undefined) {
        prepareStyleData(currentField, fieldType);
    }

    var fieldRules,
        rules = {
            text: ['id', 'name', 'outFieldId', 'tooltip', 'initialvalue', 'read-only', 'font-size', 'tabindex'],
            number: ['id', 'name', 'outFieldId', 'tooltip', 'initialvalue', 'font-size', 'tabindex'],
            email: ['id', 'name', 'outFieldId', 'tooltip', 'initialvalue', 'font-size', 'tabindex'],
            url: ['id', 'name', 'outFieldId', 'tooltip', 'initialvalue', 'read-only', 'font-size', 'tabindex'],
            select: ['id', 'name', 'outFieldId', 'tooltip', 'initialvalue', 'font-size', 'tabindex', 'select-title', 'selectfield-source'],
            radio: ['group-id', 'name', 'outFieldId', 'tooltip', 'initialvalue', 'tabindex'],
            checkbox: ['group-id', 'name', 'outFieldId', 'tooltip', 'initialvalue', 'tabindex', 'grouping', 'read-only'],
            password: ['id', 'name', 'outFieldId', 'tooltip', 'initialvalue', 'font-size', 'tabindex'],
            date: ['id', 'name', 'outFieldId', 'tooltip', 'initialvalue', 'current-date', 'read-only', 'font-size', 'tabindex'],
            label: ['id', 'name', 'initialvalue', 'font-size'],
            canvas: ['id', 'name', 'tooltip'],
            link: ['id', 'name', 'tooltip', 'initialvalue', 'href', 'font-size']
        };

    fieldRules = rules[fieldType];

    // clear and reload the available merge fields to use as postfill names
    $outFieldSelectNames.html('');
    for (var key in mergeFieldPostbackDictionary) {
        $outFieldSelectNames.append("<option value=\"" + key + "\">" + mergeFieldPostbackDictionary[key] + "</option>");
    }
    $outFieldSelectNames.prepend("<option value=\"\">- None -</option>");

    // if the field is a select, load and update the field source premade fixed values
    // (load values form dictionary, set settings from current control)
    if (fieldType === 'select') {
        manageSelectFieldSourceAndComboGroup(currentField);
    }

    //reset all the values to blank or attribute value on currentField, unbind previous field, bind event handler for current field
    $mainSettings.find('input, select').each(function () {
        var id = $(this).parent().attr('id'),
                    setting = id.slice(5), //id="main-settingName"
                    value, attributes;

        //is there a value for this setting on currentField? if so set it in the settings box
        value = (currentField.data(setting) !== undefined) ? currentField.data(setting) : '';

        if (value !== '') {
            settingType = $(this).attr('type');
            if (settingType === 'checkbox') {
                attributes = { 'checked': value };
            }
            else if (settingType === 'radio') {
                if ($(this).val() === value)
                    attributes = { 'checked': 'checked' };
            }
            else attributes = { 'value': value };

            //apply attributes variable
            if (attributes !== undefined) {
                $(this).attr(attributes);
            }
        } else {
            if ($(this).is('input') && $(this).attr('type') === 'checkbox')
                $(this).removeAttr('checked');
        }

        //unbind old events, bind current field.
        $(this).unbind('change textchange')
                .bind('change textchange', function () {
                    updateMainSettings(currentField, $(this), setting);
                });

        // bind the label's initialvalue change event, to change the html value
        if (setting === 'initialvalue' && (fieldType === 'label' || fieldType === 'link' )) {
            $(this).bind('change textchange', function () {
                thisInputField.html($(this).val());
            });
        }

        // bind the link's href change event, to change the attribute value
        if (setting === 'href' && fieldType === 'link') {
            $(this).bind('change textchange', function () {
                thisInputField.attr('href', $(this).val());
            });
        }
    });

    //Hide fields. They will be re-enabled based on rules and current inputs later
    $mainSettings.find('div.main-settings-section').css('display', 'none');

    //loop through the settings for the field and re-enable them (set back to default layout)
    for (var i = 0; i < fieldRules.length; i++) {
        var setting = fieldRules[i],
            thisMainField = $mainSettings.find('#main-' + setting).parent().css('display', 'block').find('input:first'),
            currentInput = currentField.find('input, select, label, a').first();

        settingType = thisMainField.attr('type');
        if (settingType !== 'radio' && settingType !== 'checkbox') {
            // default behavior for most of the fields
            thisMainField.val(currentField.data(setting));
        }

        // set the ID and href fields from the input attributes
        if (setting === 'id' || setting === 'href') {
            thisMainField.val(currentInput.attr(setting));
        } else if (setting === 'group-id') {
            thisMainField.val(currentField.attr('id'));
        }

        // set initial value for labels and bind the change event
        if (setting === 'initialvalue' && (fieldType === 'label' || fieldType === 'link')) {
            thisMainField.val(thisInputField.html());
        }

        // set the font-size from style properties
        if (setting === 'font-size') {
            var value = currentField.data(DATA_STYLE)[setting];
            if (value !== undefined) {
                thisMainField.val(value[DATA_STYLE_VALUE].replace('px', ''));
            }
        }

        // for select fields, show the corresponding source section according to the selected option, saved on the metadata
        if (setting === 'selectfield-source') {
            var value = currentField.data('selectfield-source');
            if (value !== undefined && value !== null && value === 'premadefixed') {
                showFixedComboSettings();
            } else {
                showManualComboSettings();
            }
        }

        // manage the 'out field' change - show the corresponding fields
        if (setting === 'out-field' && settingType === 'checkbox') {
            thisMainField.trigger('change');
        }
    }


    //loop through each of the input or option fields for the current element
    //append the form to edit that element, bind events to inputs
    if (fieldType === 'checkbox' || fieldType === 'radio' || (fieldType === 'select' && $('#setting-combo-premademanual').is(':checked'))) {
        resetInputSettings(currentField, fieldType);
    }

    $inputSettings.css('display', 'block');

    resetValidationSettings(currentField, fieldType);
}

/** Reset the field settings dialog for the current field **/
function resetInputSettings(currentField, fieldType) {
    $inputSettings.html('');

    // Show Values in main properties section
    $mainSettings.find('#input-settings-container').parent().css('display', 'block');

    currentField.find("input, option").each(function () {
        var thisInputField = $(this),
                    thisInputFieldId = thisInputField.attr('id'),
                    thisInputFieldSettings,
                    typedValue;


        //add an "option name" field for each option/choice
        $inputSettings.append($inputSettingsTmpl.tmpl({ id: thisInputFieldId + '-setting' }));

        //the handle to the "option name" field we just created
        thisInputFieldSettings = $('#' + thisInputFieldId + '-setting');

        //populate existing values
        var settingsInput = thisInputFieldSettings.find('input');
        settingsInput.val(getInputOptionValue(thisInputField, fieldType));

        //bind text change event for option
        //changed from thisInputFieldSettings.find('input[name=option-title]');
        bindInputOptionToFieldSettings(settingsInput, thisInputField);
    });

    // make the rows sortable
    $('#input-settings').sortable({
        //handle: 'span',
        placeholder: "ui-state-highlight",
        axis: 'y',
        opacity: 0.6,
        update: function (event, ui) {
            var settings = $('#input-settings').children(),
                            settingIndex = settings.index(ui.item),
                            fieldId = ui.item.attr('id').replace('-setting', ''),
                            options = $clickedContainerField.find('input, option'),
                            optionIndex = options.index($clickedContainerField.find('#' + fieldId)),
                            fieldType = getType($clickedContainerField);

            // rearrange the option values
            if (optionIndex < settingIndex) {
                for (var i = optionIndex; i < settingIndex; i++) {
                    $(options.get(i)).attr('value', $(options.get(i + 1)).attr('value'));
                    if (fieldType === 'select') {
                        $(options.get(i)).html($(options.get(i + 1)).html());
                    }
                }
            } else {
                for (var i = optionIndex; i > settingIndex; i--) {
                    $(options.get(i)).attr('value', $(options.get(i - 1)).attr('value'));
                    if (fieldType === 'select') {
                        $(options.get(i)).html($(options.get(i - 1)).html());
                    }
                }
            }

            // update the sorted option value
            $(options.get(settingIndex)).attr('value', ui.item.find('input').val());
            if (fieldType === 'select') {
                $(options.get(settingIndex)).html(ui.item.find('input').val());
            }

            // reload the values section
            resetInputSettings($clickedContainerField, fieldType);
        }
    });
}

/** Reset the validation settings section of the field settings dialog **/
function resetValidationSettings(currentField, fieldType) {
    var fieldRules,
        rules = {
            text: ['required', 'pattern', 'minimumlength', 'maxlength', 'custom-validation'],
            number: ['required', 'pattern', 'min', 'max', 'custom-validation'],
            email: ['required', 'custom-validation'],
            url: ['required'],
            select: ['required', 'custom-validation'],
            radio: ['required'],
            checkbox: ['min-selected'],
            password: ['required', 'minimumlength', 'maxlength', 'data-equals', 'custom-validation'],
            date: ['required', 'rangedate-min', 'rangedate-min-current', 'rangedate-max', 'rangedate-max-current', 'custom-validation'],
            label: [],
            canvas: ['required'],
            link: []
        };

    fieldRules = rules[fieldType];

    // reset all the values to blank or attribute value on currentField, unbind previous field, bind event handler for current field
    $validationSettings.find('input, #pattern-select').each(function () {
        var id = $(this).parent().attr('id'),
            rule = id.slice(4), // id="val-ruleName"
            value, attributes;

        // reset pattern drop down menu
        if ($(this).is('#pattern-select')) {
            $(this).val('');
        }

        // is there a value for this validation rule on currentField? if so set it in the validations settings box
        value = (currentField.data(rule) !== undefined) ? currentField.data(rule) : '';

        if (value !== '') {
            if ($(this).is('input')) {
                if ($(this).attr('type') === 'checkbox')
                    attributes = { 'checked': value };
                else attributes = { 'value': value };

                // apply attributes variable
                $(this).attr(attributes);
            } else if ($(this).is('#pattern-select')) {

                // select option if the value is one of the templates
                $(this).find('option').each(function () {
                    if ($(this).val() === value) {
                        $(this).attr('selected', 'selected');
                    }
                });
            }
        } else {
            if ($(this).is('input') && $(this).attr('type') === 'checkbox')
                $(this).removeAttr('checked');
        }

        //unbind old events, bind current field
        $(this).unbind('change textchange')
                        .bind('change textchange', function () {
                            updateValidationRules(currentField, $(this), rule);
                        });

        if (rule === 'pattern' && $(this).is('input')) {
            $(this).bind('change textchange', function () {
                $('#pattern-select').val('');
            })
        }
    });

    //Hide fields. They will be re-enabled based on rules and current inputs later
    $validationSettings.find('div.val-settings-section').css('display', 'none');

    //loop through the rules for the field type and re-enable them (set back to default layout)
    for (var i = 0; i < fieldRules.length; i++) {

        // display the corresponding section
        $validationSettings.find('#val-' + fieldRules[i]).parent().css('display', 'block');

        var thisValField = $validationSettings.find('#val-' + fieldRules[i]).find('input').first();
        thisValField.val(currentField.data(fieldRules[i]));

        if ((fieldRules[i] === 'rangedate-min' || fieldRules[i] === 'rangedate-max') && currentField.data(fieldRules[i]) !== undefined && currentField.data(fieldRules[i]) !== '') {
            var date = $.datepicker.parseDate(DATE_FORMAT, currentField.data(fieldRules[i]));
            thisValField.datepicker("setDate", date);
        }
        else if (fieldRules[i] === 'rangedate-min-current') {
            if (thisValField.is(CHECKED_INPUT)) {
                // need to disable the minimum date input field
                $rangedateMinInput.attr('disabled', 'disabled');
            } else {
                $rangedateMinInput.removeAttr('disabled');
            }
        }
        else if (fieldRules[i] === 'rangedate-max-current') {
            if (thisValField.is(CHECKED_INPUT)) {
                // need to disable the minimum date input field
                $rangedateMaxInput.attr('disabled', 'disabled');
            } else {
                $rangedateMaxInput.removeAttr('disabled');
            }
        }
        else if (fieldRules[i] === 'required') {
            if (currentField.data(fieldRules[i]) === 'checked') {
                thisValField.attr({ 'checked': 'checked' });
            } else {
                thisValField.removeAttr('checked');
            }
        }

    }

    resetCustomValidationSettings(currentField);
}

/** Reset the custom validation settings section of the field settings dialog **/
function resetCustomValidationSettings(currentField) {
    var valCount = currentField.data(DATA_VALIDATION_COUNT);
    
    // clear the custom validation section
    $customValSection.html('');

    // if there are any custom validation defined
    if (valCount !== undefined && valCount > 0) {
        // loop through them, adding the corresponding settings
        for (var i = 1; i <= valCount; i++) {

            // add a new custom validation section
            addCustomValidationSection(i);

            // load values and bind event handlers
            var valSetting = $('#' + VAL_SETTING_PREFIX + i);
            bindCustomValidationFields(currentField, valSetting);

            // make the custom validation section collapsible
            valSetting.find('.' + SETTING_CONTENT_CLASS).hide();
            valSetting.addClass(SETTING_COLLAPSED_CLASS);
            valSetting.find(VAL_COLLAPSABLE_SECTIONS).click(function () {
                $(this).parent('.' + VAL_HEADER_CLASS).nextAll('.' + SETTING_CONTENT_CLASS).slideToggle(500);
                $(this).parents('.' + VAL_SETTING_PREFIX).toggleClass(SETTING_COLLAPSED_CLASS);
            });
        }
    }

    resetDependencySettings(currentField);
}

/** Reset the dependency settings section of the field settings dialog **/
function resetDependencySettings(currentField) {
    var depCount = currentField.data(DATA_DEPENDENCY_COUNT);

    // clear the dependency section
    $dependencySection.html('');

    // if there are any dependencies defined
    if (depCount !== undefined && depCount > 0) {
        // loop through them, adding the corresponding settings
        for (var i = 1; i <= depCount; i++) {

            // add a new dependency section
            addDependencySection(i);

            // make sure it has all the properties
            if (currentField.data(DEP_EVALAUTE_OTHERWISE + i) === undefined) {
                currentField.data(DEP_EVALAUTE_OTHERWISE + i, DEP_EVALUATE_EVAL);
            }

            // load values and bind event handlers
            var depSetting = $('#' + DEP_SETTING_PREFIX + i);
            bindDependencyFields(currentField, depSetting);

            // only show the corresponding dependency type section
            showDependencyTypeSection(i);

            // make the dependency section collapsible
            depSetting.find('.' + SETTING_CONTENT_CLASS).hide();
            depSetting.addClass(SETTING_COLLAPSED_CLASS);
            depSetting.find(DEP_COLLAPSABLE_SECTIONS).click(function () {
                $(this).parent('.' + DEP_HEADER_CLASS).nextAll('.' + SETTING_CONTENT_CLASS).slideToggle(500);
                $(this).parents('.' + DEP_SETTING_CLASS).toggleClass(SETTING_COLLAPSED_CLASS);
            });
        }
    }


    resetStyleSettings(currentField);
}

/** Reset the style settings section of the field settings dialog **/
function resetStyleSettings(currentField) {
    var style = currentField.data(DATA_STYLE);

    // load the saved values
    $styleSettings.find('input').each(function () {
        var name = $(this).attr('name'),
            value = '';

        if (style !== undefined) {
            // is there a value for this validation rule on currentField? if so set it in the validations settings box
            value = (style[name] !== undefined) ? style[name][DATA_STYLE_VALUE] : '';
        }

        // transform the font-size into a number
        if (name === 'font-size') {
            value = value.replace('px', '');
        }

        // load the corresponding value
        $(this).val(value);

        var isShortHand = $(this).parents('.' + STYLE_SHORTHAND_CLASS).first().length > 0;

        //unbind old events, bind current field
        $(this).unbind('change textchange')
                .bind('change textchange', function () {
                    updateStyleSettings(currentField, $(this), isShortHand, name);
                });
    });
}





/** Loads the names of every field on the passed select control **/
function loadDependencyFieldNames(selectListControl) {
    // remove any previous option
    selectListControl.find('option').remove();

    // load all field names to the list
    $(FIELD_CONTAINER).each(function myfunction() {
        var controlId = $(this).attr('id'),
                    controlName = $(this).data().name;
        selectListControl.append('<option value=\"' + controlId + '\">' + controlName + '</option>');
    });

    // prepend an empty value option
    selectListControl.prepend('<option value=\"\">- Select a field by name -</option>');
}

/**Update the Combo Groups fixed/manual Settings Dialog when a control is selected **/
function manageSelectFieldSourceAndComboGroup(currentField) {
    var selectComboGroups = $('#main-select-prefixed-source').find('select');
    // update the premadefix combobox values
    loadComboGroupNames(selectComboGroups);

    var value = currentField.data('selectfield-source');
    // show the corresponding section according to the selected option, saved on the metadata
    if (value !== undefined && value !== null && value === 'premadefixed') {
        showFixedComboSettings();
    } else {
        showManualComboSettings();
    }
}

/** Load the select field's source combobox with the name of all available ComboGroups **/
function loadComboGroupNames(selectListControl) {
    selectListControl.find('option').remove();

    for (var key in comboValuesDictionary) {
        selectListControl.append('<option value=\"' + key + '\" selected="selected">' + comboValuesDictionary[key] + '</option>');
    }

    selectListControl.prepend('<option value=\"\" selected="selected">-Select a source-</option>');
}

/**Show up fixed filled combo boxes property settings**/
function showFixedComboSettings() {
    $('#input-settings-container').parent().css('display', 'none');
    $('#main-select-prefixed-source').parent().css('display', 'block');
}

/**Show up manual filled combo boxes property settings**/
function showManualComboSettings() {
    $('#main-select-prefixed-source').parent().css('display', 'none');
    $('#input-settings-container').parent().css('display', 'block');
}





/** Update the main settings on a specific field once changes are made in the field settings dialog **/
function updateMainSettings(currentField, mainSettingField, mainSettingRule) {
    
    if (mainSettingRule === 'font-size') {
        // update the font-size style property
        $styleSettings.find('#style-font-size input').val(mainSettingField.val()).trigger('change');
    } else if (mainSettingRule === 'read-only' && $('#main-' + mainSettingRule).find('input:first').is(':checked') && $clickedContainerField.data(DATA_REQUIRED) !== undefined) {
        // notify the user that readonly and required are mutually exclusive
        showAlert('A field can not be readonly and required at the same time');
        $('#main-' + mainSettingRule).find('input:first').attr('checked',false).removeAttr('checked');
    } else {
        saveFieldMetadata(mainSettingRule, mainSettingField.val());
    }
        

    // manage the select field source selection change
    if (mainSettingRule === 'selectfield-source') {
        if (mainSettingField.val() === 'premademanual') {
            resetInputSettings(currentField, 'select');
            showManualComboSettings();
        }
        else if (mainSettingField.val() === 'premadefixed') {
            showFixedComboSettings();
        }
    }
}

/** Update the validation rules on a specific field once changes are made in the field settings dialog **/
function updateValidationRules(currentField, validationField, validationRule) {

    // if a pattern template is selected, set pattern field value
    if ($(validationField).is('#pattern-select')) {
        $('#val-pattern').find('input:first').val(validationField.val());
    }

    // when using the min/max date current, enable/disabled the min/max date input field accordingly
    if (validationRule === 'rangedate-min-current') {
        if (validationField.is(CHECKED_INPUT)) {
            $rangedateMinInput.attr('disabled', 'disabled');
        }
        else {
            $rangedateMinInput.removeAttr('disabled');
        }
    } else if (validationRule === 'rangedate-max-current') {
        if (validationField.is(CHECKED_INPUT)) {
            $rangedateMaxInput.attr('disabled', 'disabled');
        }
        else {
            $rangedateMaxInput.removeAttr('disabled');
        }
    }

    if (validationRule === 'required' && $('#val-' + validationRule).find('input:first').is(':checked') && $clickedContainerField.data(DATA_READ_ONLY) !== undefined) {
        // notify the user that readonly and required are mutually exclusive
        showAlert('A field can not be readonly and required at the same time');
        $('#val-' + validationRule).find('input:first').attr('checked', false).removeAttr('checked');
    } else if (validationRule === 'rangedate-min' || validationRule === 'rangedate-max') {
        saveFieldMetadata(validationRule, validationField.datepicker("getDate"));
    }
    else {
        saveFieldMetadata(validationRule, validationField.val());
    }
}

function updateCustomValidationRules(currentField, validationField, validationRule) {
    saveFieldMetadata(validationRule, validationField.val());
}

/** Update the dependency rules on a specific field once changes are made in the field settings dialog**/
function updateDependencyRules(currentField, dependencyField, dependencyRule) {

    saveFieldMetadata(dependencyRule, dependencyField.val());

    if (dependencyRule.startsWith('type-dependency-')) { // type-dependency-X
        // show the corresponding section
        showDependencyTypeSection(parseInt(dependencyRule.replace('type-dependency-', '')));
    }
}

/** Update the style settings on a specific field once changes are made **/
function updateStyleSettings(currentField, styleField, isShortHand, styleProperty) {
    var style = currentField.data(DATA_STYLE);
    var fieldType = getType(currentField);
    if (styleField.val() !== '') {
        // create the required style property if needed
        if (style[styleProperty] === undefined) {
            style[styleProperty] = new Object();
        }

        if (styleProperty === 'font-size') {
            // transform the font-size into a css value
            style[styleProperty][DATA_STYLE_VALUE] = styleField.val() + 'px';
            resetResizableMinHeightAndWidth(currentField);
            currentField.css('height', '');
            // update the font-size main property
            $mainSettings.find('#main-font-size input').val(styleField.val());
        } else {
            style[styleProperty][DATA_STYLE_VALUE] = styleField.val();
        }
    } else {
        style[styleProperty] = undefined;
        if (fieldType === 'checkbox' || fieldType === 'radio') {
            currentField.css(styleProperty, '');
        } else {
            currentField.find('input, select, canvas, label, a').css(styleProperty, '');
        }
    }

    // when writing a short hand, the browser may set some properties to 'initial' value
    // these need to be removed and for now the only way is to remove the style attribute
    if (isShortHand) {
        clearStyleProperty(currentField, fieldType);
    }

    // set every style property again, just in case this was a shorthand property
    applyFieldStyles(currentField, fieldType);
}

function applyFieldStyles(currentField, fieldType) {
    var style = currentField.data(DATA_STYLE);
    if (style !== undefined) {

        $.each(style, function (key, value) {
            if (value !== undefined && key !== 'display') {
                if (fieldType === 'checkbox' || fieldType === 'radio') {
                    currentField.css(key, value[DATA_STYLE_VALUE]);
                } else {
                    currentField.find('input, select, canvas, label, a').css(key, value[DATA_STYLE_VALUE]);
                }
            }
        });

    }
}

function prepareStyleData(currentField, fieldType) {
    var shorthandProperties = $styleSettings.find('.' + STYLE_SHORTHAND_CLASS + ' input');

    currentField.data()[DATA_STYLE] = new Object();
    var style = currentField.data(DATA_STYLE);
    for (var i = 0; i < shorthandProperties.length; i++) {
        var name = $(shorthandProperties[i]).attr('name');
        style[name] = undefined;
    }
    
    // set the font-size when needed
    if (fieldType !== 'radio-field' && fieldType !== 'checkbox-field' && fieldType !== 'signature-field') {
        style['font-size'] = new Object();
        style['font-size'][DATA_STYLE_VALUE] = currentField.find('input, select, label, a').css('font-size');
    }
}

function clearStyleProperty(currentField, fieldType) {
    if (fieldType === 'checkbox' || fieldType === 'radio') {
        var opacity = currentField.css('opacity');
        var width = currentField.css('width');
        var height = currentField.css('height');
        var left = currentField.css('left');
        var top = currentField.css('top');

        currentField.removeAttr('style');
        currentField.css('opacity', opacity);
        currentField.css('width', width);
        currentField.css('height', height);
        currentField.css('left', left);
        currentField.css('top', top);
    } else {
        var innerField = currentField.find('input, select, canvas, label, a').removeAttr('style');
    }
}


/** Saved the specified metadata on the field's data object **/
function saveFieldMetadata(propertyName, propertyValue) {
    if (propertyValue !== undefined && propertyValue === '') {
        $clickedContainerField.removeData(propertyName);
    } else {
        $clickedContainerField.data(propertyName, propertyValue);
    }

    // Make any extra processing when needed - like impact it on the current html
    if (propertyName === "name" || propertyName === "tab-index") {
        $clickedContainerField.find('input, select, label, a').attr(propertyName, propertyValue);
    }
    else if (propertyName === 'read-only' || propertyName === 'grouping' || propertyName === 'current-date') {
        if ($('#main-' + propertyName).find('input:first').is(':checked')) {
            $clickedContainerField.data(propertyName, 'checked');
        } else {
            $clickedContainerField.removeData(propertyName);
        }
    }
    else if (propertyName === 'required' || propertyName === 'rangedate-min-current' || propertyName === 'rangedate-max-current') {
        if ($('#val-' + propertyName).find('input:first').is(':checked')) {
            $clickedContainerField.data(propertyName, 'checked');
        } else {
            $clickedContainerField.removeData(propertyName);
        }
    }
    else if (propertyName === 'rangedate-min' || propertyName === 'rangedate-max') {
        var stringDate = $.datepicker.formatDate(DATE_FORMAT, propertyValue);
        $clickedContainerField.data(propertyName, stringDate);
    }
}
















/****  PREVIEW MODE FUNCTIONS  ****/

/** This function is responsible for the state of the designer and provides the following functions
    - inPreviewMode: returns true if the form is in the preview state, otherwise false.
    - intoPreviewState: marks the form as in preview state
    - intoDesignerState: marks the form as in design state **/
var designerState = function () {

    function state() {
        if ($formBuilder.hasClass(PREVIEW_MODE_CLASS))
            return true;
        else
            return false;
    }

    function setPreviewState() {
        // mark the formBuilder with the PREVIEW_MODE_CLASS to indicate we entered in preview mode
        $formBuilder.addClass(PREVIEW_MODE_CLASS);
    }

    function setDesignerState() {
        // remove the PREVIEW_MODE_CLASS from the formBuilder to indicate we entered in design mode
        $formBuilder.removeClass(PREVIEW_MODE_CLASS);
    }

    return {
        inPreviewMode: function () { return state(); },
        intoPreviewState: function () { setPreviewState(); },
        intoDesignerState: function () { setDesignerState(); }
    };
}

/** Returns true if the form is in preview mode. False if it's in design mode **/
function inPreviewMode() {
    return $formDesignerState.inPreviewMode();
}

/** Toggles the form between preview and design modes **/
function tooglePreviewMode() {
    // show the loading indicator, and based on the actual state, go into preview or design mode
    if (inPreviewMode())
        setDesignerMode();
    else
        setPreviewMode();
}

/** Enters into previewMode **/
function setPreviewMode() {
    // show the loading indicator and enter preview mode
    loadingIndicator(undefined, previewModeCallback);
}

/** Auxiliary function to allow the loading indicator to finish the animation **/
function previewModeCallback() {
    //deselect any selected field
    deselectFields();
    $clickedContainerField = undefined; // to force a reload of the settings when exiting the preview mode

    // obtain the fields metadata to reset the form when exiting the preview mode
    fieldsMetadata = getMetadata(false);   // formDesignerCodes.js

    // enter into preview state
    $formDesignerState.intoPreviewState();

    // change header text
    $headerTitle.html('Preview Mode');

    // change preview text
    $previewButton.attr('title', 'Exit page preview');

    // hide menu buttons and show 'test submit' button
    $testSubmitButton.show();

    // hide field properties box
    //hideFieldSettings();

    // hide the Fields and actions toolbox controls to prevent new fields from being added or moved
    $toolbox.animate({ 'opacity': 0 }, 800);

    // hide form designer
    $formDesigner.hide();

    // copy the fields to the preview-section
    setupPreviewFormCode();  // formDesignerCodes.js

    // clean up the designer section
    $formDesigner.html('');

    // reset structures
    fieldsDataStructure = {};
    fieldObservers = new Object();

    /**** Common page setup - data, validations, dependencies ****/
    setPreviewPageSettings($previewSection);

    //remove the loading indicator
    loadingIndicator('remove');
    showNotification('Preview Mode', 2000);
}

/** Enters into designer mode **/
function setDesignerMode() {
    // show the loading indicator and enter design mode
    loadingIndicator(undefined, designerModeCallback);
}

/** Auxiliary function to allow the loading indicator to finish the animation **/
function designerModeCallback() {
    // hide the error messages div - showed by the validation plugin
    $errorSection.fadeOut();

    // enter into designer state
    $formDesignerState.intoDesignerState();

    // change header text
    $headerTitle.html('Design Mode');

    // change preview text
    $previewButton.attr('title', 'View page preview');

    // show menu buttons and hide 'test submit' button
    $testSubmitButton.hide();

    // show field properties box
    //showFieldSettings();

    // show the Fields and actions toolbox controls to allow new fields to being added and moved
    $toolbox.animate({ 'opacity': 1 }, 800);

    // clean up the preview section
    $previewSection.html('');

    // show form designer
    $formDesigner.show();

    // load the saved fields metadata into the designer form
    setFieldsMetadata(fieldsMetadata);      // formDesignerCodes.js

    //remove the loading indicator
    loadingIndicator('remove');
    showNotification('Design Mode', 2000);
}

/** Setup all validation rules and settings needed for the page instance, such as values, styles and plugins **/
function setPreviewPageSettings(pageSection) {

    // parse the fields metadata
    var metadata = jQuery.parseJSON(fieldsMetadata);
    transformMetadataToFieldsData(metadata);  // common.js

    // copy data information when needed
    for (var i = 0; i < metadata.length; i++) {
        var fieldId = metadata[i]['FieldId'];
        var fieldContainer = pageSection.find('#' + fieldId);
        fieldsDataStructure[fieldId] = {};
        fieldsDataStructure[fieldId].container = fieldContainer;
        fieldsDataStructure[fieldId].type = metadata[i][DATA_FIELD_TYPE];
        fieldsDataStructure[fieldId].innerFields = fieldContainer.find(INNER_FIELDS);
        setHtmlMetadata(metadata[i], fieldContainer);  // common.js
    }

    // load select fields values from server, when using 'premade fixed' source option
    loadPremadeValuesForSelectFields(pageSection); // common.js

    // setup more common settings - styles, tooltips, dates, signatures
    setPageCommonSettings(pageSection); // common.js

    // setup initial values
    prepareInitialValues(pageSection, mergeFieldValuesDictionary);     // common.js
    setInitialValues(pageSection);  // common.js

    // enable dependency validation settings
    setPageDependencies(pageSection);  // common.js

    // enable checkbox to run the validation when a change event is raised
    setCheckboxChangeEventHandler(pageSection, $errorSection, fieldValidationSuccess);  // common.js

    // setup all the validations required to the current page
    setPageValidationSettings(pageSection, pageSubmitCustomAction, fieldValidationSuccess);  // common.js

    // setup the custom field validations
    registerCustomValidations(pageSection);  // common.js
    
    // apply uniform plugin to checkboxes and radio buttons
    pageSection.find(CHECKBOX_RADIO_INPUTS).uniform().removeAttr('style');
}

/** Handles the onSuccess event raised by the validator **/
function fieldValidationSuccess(e, els) {
    // checks for the next error to indicate to the user
    checkNextError($previewSection, $errorSection, fieldValidationSuccess); // common.js
}

/** Custom action to perform when the form is submitted and all validations are passed **/
function pageSubmitCustomAction(form) {
    // let user know via notification
    showNotification(VALIDATION_SUCCESS_NOTIFICATION);
}




/****  AUXILIAR FUNCTIONS  ****/

/** Pseudo GUID Generator  **/
function guidGenerator() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

/** Determine if a particular field has the required attribute set**/
function isRequired(field) {
    var attr = field.find('input:first, textarea, select').attr('required');
    return field.hasClass('required') || ((attr !== undefined) && (attr !== false)); //since some browsers (chrome) will strip require=required to just required
}

/** Opens a modal confirmation dialog with the supplied title and message
    If the user confirms, the action supplied is executed **/
function confirmAction(action, title, message) {
    // if no title is passed, use a default one
    if (title === undefined)
        title = DEFAULT_CONFIRM_ACTION_TITLE;

    // set the corresponding message
    if (message !== undefined)
        $confirmDialog.find('.' + MESSAGE_CLASS).html(message).css('display', 'block');
    else 
        $confirmDialog.find('.' + MESSAGE_CLASS).html('').css('display', 'none');

    // show the jQueryUI modal dialog
    $confirmDialog.dialog({
        resizable: false,
        title: title,
        modal: true,
        buttons: {
            "Yes": function () {
                $(this).dialog("close");
                // in this case, execute the supplied action
                action();
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });
}

/** Shows an application notification **/
function showNotification(message, timeout) {
    //don't want a previously set timeout to prematurely clear this message if notification is called in rapid succession
    clearTimeout(notificationTimeout);
    $notification.html(message).css('display', 'block').animate({ opacity: 1 }, 'fast');

    if (timeout === undefined)
        timeout = 2000;

    notificationTimeout = setTimeout(function () {
        hideNotification();
    }, timeout);
}

/** Hides the actual application notification **/
function hideNotification() {
    $notification.animate({ opacity: 0 }, 'fast', function () {
        $(this).css('display', 'none')
    });
}

/** Given a text element, inserts the provided text on the field's current cursor position **/
function insertAtCaret(element, text) {
    if (document.selection) {
        element.focus();
        var sel = document.selection.createRange();
        sel.text = text;
        element.focus();
    } else if (element.selectionStart || element.selectionStart === 0) {
        var startPos = element.selectionStart;
        var endPos = element.selectionEnd;
        var scrollTop = element.scrollTop;
        element.value = element.value.substring(0, startPos) + text + element.value.substring(endPos, element.value.length);
        element.focus();
        element.selectionStart = startPos + text.length;
        element.selectionEnd = startPos + text.length;
        element.scrollTop = scrollTop;
    } else {
        element.value += text;
        element.focus();
    }
}

function ieNotice(alert) {
    $('<div>' + alert + '</div>').dialog({
        resizable: false,
        title: 'Alert',
        modal: true,
        buttons: {}
    });
}







/**** COMMON FUNCTIONS ****/

/** Clear all elements from the form **/
function resetForm() {
    deselectFields();
    $formDesigner.html('').removeAttr('enctype');
    showNotification('Form Reset');
}

/** Make the fields resizeable **/
function bindResizableToFields(fields) {
    var columnWidth = $formBuilder.width() / 4,
        margin = .04 * (columnWidth * 4),
        max = (columnWidth * 4) - margin,
        min = columnWidth - margin;

    fields.resizable({
        handles: 'se',
        maxWidth: max,
        minWidth: getResizableFieldMinWidth(fields),
        minHeight: getResizableFieldMinHeight(fields)
    });
}

/** Sets the MinHeight and MinWidth attribute for a resizable control **/
function resetResizableMinHeightAndWidth(control) {
    control.resizable("option", "minHeight", getResizableFieldMinHeight(control))
    control.resizable("option", "minWidth", getResizableFieldMinWidth(control))
}

/** Returns the min width for a resizable control based on the control's type **/
function getResizableFieldMinWidth(control) {

    switch (getType(control.find('canvas, input, select, label, a').first())) {
        case "text": case "password": case "email": case "number": case "date": case "select": case "label": case "link":
            return 10;
        case "canvas":
            return 50;

        // in these cases we need to calculate the width based on the position of the internal options
        case "radio": case "checkbox":
            var leftmost;
            var controlOffset = control.offset().left;
            control.find(CHECK_RADIO_OPTIONS).each(function () {
                // calculate the option's left offset
                var currentLeftValue = $(this).offset().left - controlOffset;

                // update the leftmost variable when appropriate
                if (leftmost === undefined || (currentLeftValue > leftmost.offset().left - controlOffset))
                    leftmost = $(this);
            });
            return (leftmost.offset().left - controlOffset) + leftmost.width();
    }
}

/** Returns the min height for a resizable control based on the control's type **/
function getResizableFieldMinHeight(control) {
    var innerField;

    switch (getType(control.find('canvas, input, select, label, a').first())) {
        case "text": case "password": case "email": case "number": case "date":
            innerField = 'input';
            break;
        case "select":
            innerField = 'select';
            break;
        case "label":
            innerField = 'label';
            break;
        case "link":
            innerField = 'a';
        case "canvas":
            return 20;

        // in these cases we need to calculate the height based on the position of the internal options
        case "radio":case "checkbox":
            var lowest;
            var controlOffset = control.offset().top;
            control.find(CHECK_RADIO_OPTIONS).each(function () {
                // calculate the option's top offset
                var currentTopValue = $(this).offset().top - controlOffset;

                // update the lowest variable when appropriate
                if (lowest === undefined || (currentTopValue > lowest.offset().top - controlOffset))
                    lowest = $(this);
            });
            return (lowest.offset().top - controlOffset) + lowest.height();
    }

    return control.find(innerField).first().height() + 6;
}


/** Provides functions to handle the alignment of fields **/
function Alignment() {
    /// <summary>Provides functions to handle the alignment of fields.</summary>

    var that = this;

    this.getMinTopOffset = function (control) {
        /// <summary>Returns the minimum top offset of the inner fields for the specified control.</summary>
        /// <param name="control" type="Object">The field container element.</param>
        /// <returns type="Number"></returns>

        var $control = $(control);
        var type = getType($control);

        if (type !== 'checkbox' && type !== 'radio') {
            return $control.find('input, select, canvas, label, a').first().offset().top;
        } else {
            var minTop = 999999;
            $control.find(CHECK_RADIO_OPTIONS).each(function () {
                if ($(this).offset().top < minTop) {
                    minTop = $(this).offset().top;
                }
            });
            return minTop;
        }
    }

    this.getMaxBottomOffset = function (control) {
        /// <summary>Returns the maximum bottom offset (including height) of the inner fields for the specified control.</summary>
        /// <param name="control" type="Object">The field container element.</param>
        /// <returns type="Number"></returns>

        var $control = $(control);
        var type = getType($control);

        if (type !== 'checkbox' && type !== 'radio') {
            var innerField = $control.find('input, select, canvas, label, a').first();
            return innerField.offset().top + innerField.height();
        } else {
            var maxTop = -1;
            var itemHeight = $control.find(CHECK_RADIO_OPTIONS).first().height();

            $control.find(CHECK_RADIO_OPTIONS).each(function () {
                if ($(this).offset().top > maxTop) {
                    maxTop = $(this).offset().top;
                }
            });
            return maxTop + itemHeight;
        }

    }

    this.getMinLeftOffset = function (control) {
        /// <summary>Returns the minimum left offset of the inner fields for the specified control.</summary>
        /// <param name="control" type="Object">The field container element.</param>
        /// <returns type="Number"></returns>

        var $control = $(control);
        var type = getType($control);

        if (type !== 'checkbox' && type !== 'radio') {
            return $control.find('input, select, canvas, label, a').first().offset().left;
        } else {
            var minLeft = 999999;
            $control.find(CHECK_RADIO_OPTIONS).each(function () {
                if ($(this).offset().left < minLeft) {
                    minLeft = $(this).offset().left;
                }
            });
            return minLeft;
        }
    }

    this.getMaxLeftOffset = function (control) {
        /// <summary>Returns the maximum left offset (including width) of the inner fields for the specified control.</summary>
        /// <param name="control" type="Object">The field container element.</param>
        /// <returns type="Number"></returns>

        var $control = $(control);
        var type = getType($control);

        if (type !== 'checkbox' && type !== 'radio') {
            var innerField = $control.find('input, select, canvas, label, a').first();
            return innerField.offset().left + innerField.width();
        } else {
            var maxLeft = -1;
            var itemWidth = $control.find(CHECK_RADIO_OPTIONS).first().width();

            $control.find(CHECK_RADIO_OPTIONS).each(function () {
                if ($(this).offset().left > maxLeft) {
                    maxLeft = $(this).offset().left;
                }
            });
            return maxLeft + itemWidth;
        }

    }

    this.verticalAlign = function (control, topOffset) {
        /// <summary>Vertically aligns the inner fields to the passed topOffset for the specified control.</summary>
        /// <param name="control" type="Object">The field container element.</param>
        /// <param name="topOffset" type="Number">The top offset to set the inner fields to.</param>
        /// <returns type="void"></returns>

        var $control = $(control);
        var type = getType($control);
        var containerOffset = $control.offset().top;

        if (type !== 'checkbox' && type !== 'radio') {
            var fieldOffset = $control.find('input, select, canvas, label, a').first().offset().top;
            $control.offset({ top: topOffset - (fieldOffset - containerOffset) });
        } else {
            // vertical align each inner option
            $control.find(CHECK_RADIO_OPTIONS).each(function () {
                $(this).offset({ top: containerOffset + CHECK_RADIO_CONTAINER_DISTANCE });
            });

            // resize the container
            resetResizableMinHeightAndWidth($control);
            $control.css('height', $control.resizable("option", "minHeight"));

            // move the container to align the fields to the specified topOffset
            $control.offset({ top: topOffset - CHECK_RADIO_CONTAINER_DISTANCE });
        }
    }

    this.horizontalAlign = function (control, leftOffset) {
        /// <summary>Horizontally aligns the inner fields to the passed leftOffset for the specified control.</summary>
        /// <param name="control" type="Object">The field container element.</param>
        /// <param name="leftOffset" type="Number">The left offset to set the inner fields to.</param>
        /// <returns type="void"></returns>

        var $control = $(control);
        var type = getType($control);
        var containerOffset = $control.offset().left;

        if (type !== 'checkbox' && type !== 'radio') {
            var fieldOffset = $control.find('input, select, canvas, label, a').first().offset().left;
            $control.offset({ left: leftOffset - (fieldOffset - containerOffset) });
        } else {
            // horizontal align each inner option
            $control.find(CHECK_RADIO_OPTIONS).each(function () {
                $(this).offset({ left: containerOffset + CHECK_RADIO_CONTAINER_DISTANCE });
            });

            // resize the container
            resetResizableMinHeightAndWidth($control);
            $control.css('width', $control.resizable("option", "minWidth"));

            // move the container to align the fields to the specified topOffset
            $control.offset({ left: leftOffset - CHECK_RADIO_CONTAINER_DISTANCE });
        }
    }

    this.alignTop = function (controls) {
        /// <summary>Vertically aligns the specified controls with the top most field.</summary>
        /// <param name="controls" type="Object">The field container elements to align.</param>
        /// <returns type="void"></returns>

        var minTop = 999999;

        // get the min top offset for each field
        $(controls).each(function () {
            var offset = that.getMinTopOffset($(this));
            if (offset < minTop) {
                minTop = offset;
            }
        });

        // set the top offset of each field to the min top calculated
        $(controls).each(function () {
            that.verticalAlign(this, minTop);
        })
    }

    this.alignBottom = function (controls) {
        /// <summary>Vertically aligns the specified controls with the bottom most field.</summary>
        /// <param name="controls" type="Object">The field container elements to align.</param>
        /// <returns type="void"></returns>

        var maxHeight = -1;

        // get the min top offset for each field
        $(controls).each(function () {
            var offset = that.getMaxBottomOffset($(this));
            if (offset > maxHeight) {
                maxHeight = offset;
            }
        });

        // set the top offset of each field to the min top calculated
        $(controls).each(function () {
            var type = getType($(this)),
                fieldHeight;

            if (type !== 'checkbox' && type !== 'radio') {
                fieldHeight = $(this).find('input, select, canvas, label, a').first().height();
            } else {
                fieldHeight = $(this).find(CHECK_RADIO_OPTIONS).first().height();
            }

            that.verticalAlign(this, maxHeight - fieldHeight);
        })
    }

    this.alignLeft = function (controls) {
        /// <summary>Horizontally aligns the specified controls with the left most field.</summary>
        /// <param name="controls" type="Object">The field container elements to align.</param>
        /// <returns type="void"></returns>

        var minLeft = 999999;

        // get the min left offset for each field
        $(controls).each(function () {
            var offset = that.getMinLeftOffset($(this));
            if (offset < minLeft) {
                minLeft = offset;
            }
        });

        // set the top offset of each field to the min top calculated
        $(controls).each(function () {
            that.horizontalAlign(this, minLeft);
        })
    }

    this.alignRight = function (controls) {
        /// <summary>Vertically aligns the specified controls with the right most field.</summary>
        /// <param name="controls" type="Object">The field container elements to align.</param>
        /// <returns type="void"></returns>

        var maxWidth = -1;

        // get the min top offset for each field
        $(controls).each(function () {
            var offset = that.getMaxLeftOffset($(this));
            if (offset > maxWidth) {
                maxWidth = offset;
            }
        });

        // set the top offset of each field to the min top calculated
        $(controls).each(function () {
            var type = getType($(this)),
                fieldWidth;

            if (type !== 'checkbox' && type !== 'radio') {
                fieldWidth = $(this).find('input, select, canvas, label, a').first().width();
            } else {
                fieldWidth = $(this).find(CHECK_RADIO_OPTIONS).first().width();
            }

            that.horizontalAlign(this, maxWidth - fieldWidth);
        })
    }

}


function Cloning() {
    /// <summary>Provides functions to clone fields.</summary>

    this.cloneField = function (field) {
        var $field = $(field);
        if ($field.length === 1) {

            // get field metadata
            var fieldMetadata = getFieldMetadata($field, true);     // formDesignerCodes.js
            var fieldId = fieldMetadata.FieldId.slice(0, fieldMetadata.FieldId.indexOf('-'));
            var newFieldId = guidGenerator().replace(/-/g, '');

            // Replace the ID on the possible properties
            // fieldID, HTML field container ID, name
            fieldMetadata[DATA_FIELD_ID] = fieldMetadata[DATA_FIELD_ID].replace(fieldId, newFieldId);
            fieldMetadata[DATA_HTML] = fieldMetadata[DATA_HTML].replace(new RegExp(fieldId, 'g'), newFieldId);
            fieldMetadata[DATA_NAME] = 'field' + newFieldId;

            // clone the field
            var clonedField = setFieldMetadata(fieldMetadata);      // formDesignerCodes.js

            // Replace the name on the generated html
            clonedField.find('input, select, canvas, label, a').attr('name', 'field' + newFieldId);

            // Move the field so it doesn't overlap with the original
            clonedField.css('top', (parseInt(clonedField.css('top').replace('px', '')) + 30).toString() + 'px');
            clonedField.css('left', (parseInt(clonedField.css('left').replace('px', '')) + 50).toString() + 'px');

            selectField(clonedField);
        }
    }

}

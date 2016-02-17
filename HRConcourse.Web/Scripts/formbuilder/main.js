/// <reference path="jquery-1.7.1.js"/>

// auxiliary global variables
var regularValidationErrors = false;
var checkboxOptionVerification = false;

$(document).ready(function () {

    var nextDoc, nextPage;

    //  set screen layout
    setScreenLayout();

    // control the slider click event to show or hide the doc menu
    $('#slider-control').click(function () {
        if ($('#slider-control').hasClass('hidden')) {
            showSlider();
        } else {
            hideSlider();
        }
    });

    //    //File Upload Sttings
    //    $('#file_upload').fileUploadUI({
    //        uploadTable: $('#files'),
    //        downloadTable: $('#files'),
    //        buildUploadRow: function (files, index) {
    //            return $('<tr><td class="file_upload_preview"><\/td>' +
    //                        '<td>' + files[index].name + '<\/td>' +
    //                        '<td class="file_upload_progress"><div><\/div><\/td>' +
    //                        '<td class="file_upload_start">' +
    //                        '<button class="ui-state-default ui-corner-all" title="Start Upload">' +
    //                        '<span class="ui-icon ui-icon-circle-arrow-e">Start Upload<\/span>' +
    //                        '<\/button><\/td>' +
    //                        '<td class="file_upload_cancel">' +
    //                        '<button class="ui-state-default ui-corner-all" title="Cancel">' +
    //                        '<span class="ui-icon ui-icon-cancel">Cancel<\/span>' +
    //                        '<\/button><\/td><\/tr>');
    //        },
    //        buildDownloadRow: function (file) {
    //            return $('<tr><td>' + file.name + '<\/td><\/tr>');
    //        },
    //        beforeSend: function (event, files, index, xhr, handler, callBack) {
    //            handler.uploadRow.find('.file_upload_start button').click(callBack);
    //        }
    //    });
    //    $('#start_uploads').click(function () {
    //        $('.file_upload_start button').click();
    //    });
    //    $('#cancel_uploads').click(function () {
    //        $('.file_upload_cancel button').click();
    //    }); 



    // setup the print page message
    $('.print-button').printPage({
        message: 'Your document is being created'
    });

    // control the print icon click event
    $('.print-image').click(function () {
        $('#print-link').attr('printing', 'true');
        // execute print document link
        $('#print-link').attr('href', $(this).attr('href'));
        $('#print-link').trigger('click');
    });

    // setup document accordion
    $("#documentAccordion").accordion({
        autoHeight: false,
        collapsible: true,
        active: false,
        event: ""
    });

    // setup approved document accordion
    $("#approvedDocumentAccordion").accordion({
        autoHeight: false,
        collapsible: true,
        active: false,
        event: ""
    });

    // bind click to accordion titles, to avoid expand/collaps when clicked on print icon
    $("#documentAccordion h3").click(function () {
        var idx = $("#documentAccordion h3").index(this),
            printing = $('#print-link').attr('printing'),
            currentDocument = $('.selected-document'),
            id = $(this).find('a').attr('id');

        // activate accordion if not printing
        if (printing !== undefined && printing === 'true') {
            $('#print-link').removeAttr('printing');
        } else {
            $("#documentAccordion").accordion("activate", idx);

            // deselect current document, and select the new one
            if (currentDocument.length > 0) {
                currentDocument.removeClass('selected-document');
            }
            $('#' + id).addClass('selected-document');
        }
    });

    // bind click to accordion titles, to avoid expand/collaps when clicked on print icon
    $("#approvedDocumentAccordion h3").click(function () {
        var idx = $("#approvedDocumentAccordion h3").index(this),
            printing = $('#print-link').attr('printing');

        // activate accordion if not printing
        if (printing !== undefined && printing === 'true') {
            $('#print-link').removeAttr('printing');
        } else {
            $("#approvedDocumentAccordion").accordion("activate", idx);
        }
    });

    // bind click to upload and summary link, to disable navigation buttons
    $('#upload-documents-link, #summary-link').click(function () {
        // disable skip, and submit buttons
        $('#skip-control').addClass('inactive');
        $('#submit-control').attr('disabled', 'disabled').addClass('inactive');

        // disable back button if there are no documents
        nextDoc = $('#documentAccordion h3 a').last();
        if (nextDoc.length === 0) {
            $('#back-control').addClass('inactive');
        } else {
            $('#back-control').removeClass('inactive');
        }

        // hide navigation buttons
        $('#nav-page-controls').css('display', 'none');

        // disable current page if selected
        var currentPage = $('.selected-page');
        if (currentPage.length > 0) {
            currentPage.removeClass('selected-page');
        }

        // collaps all documents
        $("#documentAccordion").accordion("activate", false);

        // deselect current document
        var currentDocument = $('.selected-document');
        if (currentDocument.length > 0) {
            currentDocument.removeClass('selected-document');
        }
    });

    // control back button's click event
    $('#back-control').click(function () {
        // do nothing if inactive
        if ($(this).hasClass('inactive')) {
            return;
        }

        var currentPage = $('.selected-page'),
            docPages = $('#documentAccordion ol li'),
            i = 0;

        if (docPages.length > 0) {

            // if its on the summary, go to last page
            if (currentPage.length === 0 && $('#submit-control').attr('disabled') === 'disabled') {
                // select last page and document
                nextPage = docPages.last();
            }
            else {
                // find current selected page's index
                i = docPages.index(currentPage);

                // find previous page using module
                nextPage = $(docPages[(i - 1 + docPages.length) % docPages.length]);
            }

            // select the next document page
            nextPage.find('a').trigger('click');
        }
    });

    // control skip button's click event
    $('#skip-control').click(function () {
        // do nothing if inactive
        if ($(this).hasClass('inactive')) {
            return;
        }

        var currentPage = $('.selected-page'),
            docPages = $('#documentAccordion ol li'),
            i = 0;

        // if there is a selected page
        if (docPages.length > 0 && currentPage.length > 0) {

            // find current selected page's index, plus one
            i = docPages.index(currentPage) + 1;

            // find next page which is not filled, if there is any
            while ((i < docPages.length) && ($(docPages[i]).find('div').hasClass('Filled'))) {
                i++;
            }

            // go to next page if it was found
            if (i < docPages.length) {
                nextPage = $(docPages[i]);
                nextPage.find('a').trigger('click');
            }
            else {
                // if previous page was the last page of a diferent document wich require hard signature, prompt the user to print
                if (currentPage.find('div:last').attr('requires-hard-signature') === 'true') {
                    var printImage = currentPage.parent().prev('h3').find('a:first img');
                    confirmAction(function () {
                        printImage.trigger('click');
                    }, 'Print Document', 'The previously selected document requires to be hand signed. Would you like to print it now?');
                }

                // go to summary
                $('#summary-link').trigger('click');
            }
        }
    });



    // setup documents which are submited but need hand signature
    $('#documentAccordion h3 a').each(function () {
        if ($(this).attr('requires-hard-signature') === 'true' && $(this).find('span').hasClass('Submitted')) {
            $(this).find('span').removeClass('Submitted').addClass('RequiresHardSignature');
        }
    });



    // adds an effect called "customErrors" to the validator
    $.tools.validator.addEffect("customErrors", function (errors, event) {

        // get the error messages div
        var wall = $(this.getConf().container).fadeIn();

        if (checkboxOptionVerification === false) {
            // remove all previous error messages
            wall.find("p").remove();

            // add new ones
            $.each(errors, function (index, error) {
                wall.append("<p><strong>" + error.input.attr("name") + "</strong> " + error.messages[0] + "</p>");
            });

            // remove previous error messages
            $('div.error').remove();
            // show only the first of the error message
            if (errors[0] !== undefined) {
                var top = errors[0].input.offset().top - 25;
                var left = errors[0].input.offset().left - 16;
                var message = errors[0].messages[0];
                $('body').append("<div class=\"error\" style=\"visibility: visible; position: absolute; top: " + top + "px; left: " + left + "px; display: block;\"><em></em><p>" + message + "</p></div>");
            }

            // set aux variable to true, to indicate that errors have occurred
            regularValidationErrors = true;

        } else {

            if (regularValidationErrors === false) {
                // remove all previous error messages
                wall.find("p").remove();

                // add new ones
                $.each(errors, function (index, error) {
                    wall.append("<p><strong>" + error.input.attr("name") + "</strong> " + error.messages[0] + "</p>");
                });

                // remove previous error messages
                $('div.error').remove();
                // show only the first of the error message
                if (errors[0] !== undefined) {
                    var top = errors[0].input.offset().top - 32;
                    var left = errors[0].input.offset().left - 30;
                    var message = errors[0].messages[0];
                    $('body').append("<div class=\"error\" style=\"visibility: visible; position: absolute; top: " + top + "px; left: " + left + "px; display: block;\"><em></em><p>" + message + "</p></div>");
                }
            } else {
                var height = $('#formErrors').find('p:first').height();

                // adjust previous error messages
                $.each(errors, function (index, error) {

                    $('body div.error').each(function () {
                        $(this).css('top', $(this).offset().top + height + "px")
                    });
                });

                // add new ones
                $.each(errors, function (index, error) {
                    wall.append("<p><strong>" + error.input.attr("name") + "</strong> " + error.messages[0] + "</p>");
                });

                regularValidationErrors = false;
            }
        }

    }, function (inputs) {
        // hide the error messages div
        var wall = $('#formErrors').fadeOut();
        // remove the error messages
        $('div.error').remove();
    });




    // after all bindings, select the next page to fill or go to summary
    nextDoc = $('#documentAccordion h3 a span.Sent, #documentAccordion h3 a span.PartiallyCompleted, #documentAccordion h3 a span.Denied, #documentAccordion h3 a span.Expired').first();
    nextPage = $('#documentAccordion ol li div.Unfilled, #documentAccordion ol li div.NotApproved, #documentAccordion ol li div.DraftSaved').first();
    if (nextDoc.length > 0) {
        nextDoc.trigger('click');
        nextPage.parent('li').find('a').trigger('click');
    } else {
        // go to summary
        $('#summary-link').trigger('click');
    }
});



/****   FUNCTIONS   *****/

/* Set the layout based on the window's width */
function setScreenLayout() {
    var browserWidth = document.documentElement.clientWidth;
    var bodyClass;
    if (browserWidth < 1230) {
        bodyClass = 'small-width';
        $('#controls').removeAttr('style');
        $('#slider-control').addClass('hidden');
        $('#slider-open-close').attr('src', '/Images/slider-open.png');
    } else {
        bodyClass = 'normal-width';
        $('#controls').removeAttr('style');
    }
    document.body.className = bodyClass;
};

/* Show the doc menu controls */
function showSlider() {
    $('#controls').animate({ marginLeft: "20px" }, 500, 'swing');
    $('#slider-open-close').attr('src', '/Images/slider-close.png');
    $('#slider-control').removeClass('hidden');
}

/* Hide the doc menu controls */
function hideSlider() {
    $('#controls').animate({ marginLeft: "-190px" }, 500, 'swing');
    $('#slider-open-close').attr('src', '/Images/slider-open.png');
    $('#slider-control').addClass('hidden');
}

/* Control the click event on a page instance link */
function linkClick(id) {
    var currentPage = $('.selected-page'),
        currentDoc = $('.selected-document'),
        nextPage = $('#' + id),
        nextDoc = nextPage.parents('ol').prev('h3').find('a');

    // show navigation buttons
    $('#nav-page-controls').css('display', 'block');

    // pre-activate navigation controls and submit button
    $('#back-control').removeClass('inactive');
    $('#skip-control').removeClass('inactive');
    $('#submit-control').removeAttr('disabled').removeClass('inactive');

    // deactivate back button if the first page is selected
    if ($('#documentAccordion ol li a').first().attr('id') === id) {
        $('#back-control').addClass('inactive');
    }

    // disable submit button if the page is already Approved
    if (nextPage.next('div').hasClass('Approved')) {
        $('#submit-control').attr('disabled', 'disabled').addClass('inactive');
    } else {
        $('#submit-control').removeAttr('disabled').removeClass('inactive');
    }

    // if previous page was the last page of a diferent document wich require hard signature, prompt the user to print
    if (currentPage.length > 0) {
        if (currentPage.find('div:last').attr('requires-hard-signature') === 'true' &&
                nextDoc.attr('id') !== currentPage.parent().prev('h3').find('a:first').attr('id')) {

            var printImage = currentPage.parent().prev('h3').find('a:first img');
            confirmAction(function () {
                printImage.trigger('click');
            }, 'Print Document', 'The previously selected document requires to be hand signed. Would you like to print it now?');
        }

        // deselect the current page
        currentPage.removeClass('selected-page');
    }


    // change document selection if necessary
    if (currentDoc.length === 0 || (currentDoc.length > 0 && nextDoc.attr('id') !== currentDoc.attr('id'))) {
        nextDoc.trigger('click');
    }

    // select the current page
    nextPage.parent('li').addClass('selected-page');

    // clear the document area
    $('#documentFillPlace').empty();
};


function approvedLinkClick(id) {
    var currentPage = $('.selected-approved-page'),
        nextPage = $('#' + id),
        nextDoc = nextPage.parents('ol').prev('h3').find('a');

    if (currentPage.length > 0) {
        currentPage.removeClass('selected-approved-page');
    }

    nextPage.parent('li').addClass('selected-approved-page');

    // deactivate navigation controls and submit button
    $('#back-control').addClass('inactive');
    $('#skip-control').addClass('inactive');
    $('#submit-control').attr('disabled', 'disabled').addClass('inactive');
}


function beginLoadPage() {
    // remove previous error messages
    $('.error').remove();
}

/** Get a field's type**/
function getType(field) {
    var input;

    if (!field.is('input, select, option, textarea'))
        input = field.find('input:first, select, textarea');
    else input = field;

    //.ttw-range and .ttw-date are hacks b/c chrome is currently stripping the type attribute from these fields!
    if (input.is('.ttw-range'))
        return 'range';
    else if (input.is('.ttw-date'))
        return 'date';
    else return (input.is('input')) ? input.html5type() : (input.is('select, option')) ? 'select' : (input.is('textarea')) ? 'textarea' : '';
}

/* Setup all validation rules and settings needed for the page instance */
function setDocumentProperties() {
    //Style selects, checkboxes, etc
    $("input:checkbox, input:radio").uniform().removeAttr('style');

    //${date_range_inputs}
    //fill date field with current date or initial value, when required
    $('.ttw-date').each(function () {
        var minDate = $(this).attr('rangedate-min') !== undefined && $(this).attr('rangedate-min') !== '' ? $.datepicker.parseDate("mm/dd/yy", $(this).attr('rangedate-min')) : '',
            maxDate = $(this).attr('rangedate-max') !== undefined && $(this).attr('rangedate-max') !== '' ? $.datepicker.parseDate("mm/dd/yy", $(this).attr('rangedate-max')) : '';

        $(this).datepicker({
            dateFormat: 'mm/dd/yy',
            changeMonth: true,
            changeYear: true,
            showButtonPanel: true,
            showOtherMonths: true,
            selectOtherMonths: true,
            yearRange: '-150:+10',
            minDate: minDate,
            maxDate: maxDate
        });

        // set the corresponding date
        if ($(this).attr('value') !== undefined && $(this).attr('value') !== '') {
            $(this).datepicker("setDate", new Date($(this).attr('value')));
        } else {
            // if the current-date option was set, use today date. Or use the initial value, if it was set
            if ($(this).attr('current-date') !== undefined && $(this).attr('current-date') === 'checked') {
                $(this).datepicker("setDate", new Date());
            } else if ($(this).attr('initialvalue') !== undefined && $(this).attr('initialvalue') !== '') {
                $(this).datepicker("setDate", new Date($(this).attr('initialvalue')));
            }
        }
    });

    // Load select field values
    $('.TTWForm select').each(function () {
        $(this).val($(this).attr('selectedValue'));
    });

    // Fill label fields with initial values
    $('.TTWForm .field label').each(function () {
        $(this).html($(this).attr('initialvalue'));
    });


    /**  If the page is already Approved, disable all fields  **/
    if ($('.selected-page, .selected-approved-page').find('div').hasClass('Approved')) {
        $('.field input, select').each(function () {
            $(this).attr('disabled', 'disabled');
        });
    }

    /**
    * Get the jQuery Tools Validator to validate checkbox and
    * radio groups rather than each individual input
    */
    $('[type=checkbox]').bind('change', function () {
        clearCheckboxError($(this));
        if (!$(this).is(':checked')) {
            $(this).removeAttr('checked');
        }
    });

    //validate checkbox and radio groups
    function validateCheckRadio() {
        var err = {};

        $('.radio-group, .checkbox-group').each(function () {
            if ($(this).hasClass('required'))
                if (!$(this).find('input:checked').length)
                    err[$(this).find('input:first').attr('name')] = 'Please complete this mandatory field.';

        });

        $('.checkbox-group').each(function () {
            var min = $(this).attr('min-selected');
            if (min !== undefined && min !== '' && min !== '0') {
                if ($(this).find('input:checked').length < min) {
                    err[$(this).find('input:first').attr('name')] = 'Please select at least ' + min + ' option' + (min > 1 ? 's' : '');
                }
            }
        });

        if (!$.isEmptyObject(err)) {
            var validator = $('#form1').data('validator');
            // set aux variable to true, to indicate we are passing checkbox/option errors to the validator custom effect
            checkboxOptionVerification = true;
                validator.invalidate(err);
            checkboxOptionVerification = false;
            return false
        }
        else return true;
    }

    //clear any checkbox errors
    function clearCheckboxError(input) {
        if ($('#formErrors').css('display') === 'block') {
            checkNextError();
        }

        /** Old checkbox clear code **
        var parentDiv = input.parents('.field'),
            min = parentDiv.attr('min-selected'),
            validator = $('#form1').data('validator');

        if (min !== undefined && min !== '' && min !== '0') {
            if (parentDiv.find('input:checked').length >= min) {
                validator.reset(parentDiv.find('input:first'));
                parentDiv.find('.error').remove();
            }
        } else {
            validator.reset(parentDiv.find('input:first'));
            parentDiv.find('.error').remove();
        }*/
    }
    
    // define dependency validation
    var dependencyValidation = function () {
        var depField = $(this),
            fieldName = depField.attr('name'),
            fieldType = getType(depField);

        $('.field input, .field select, div.radio-group, div.checkbox-group, .field label').each(function () {
            var depName = $(this).attr('name-dependency'),
                depValue = $(this).attr('value-dependency'),
                depProperty = $(this).attr('property-target'),
                depCss = $(this).attr('css-target');

            // if dependency is defined for the changed field, change property value
            if (depName !== undefined && depName !== '' && depName === fieldName &&
                depValue !== undefined && depValue !== '' &&
                (depProperty !== undefined && depProperty !== '' || depCss !== undefined && depCss !== '')) {

                if (fieldType !== 'checkbox' || depField.val() === depValue) {
                    var propertyValue;
                    // if it is a checkbox and is checked, or if the value is the expected for the other type of fields
                    if ((fieldType === 'checkbox' && depField.is(':checked')) || (fieldType !== 'checkbox' && depField.val() === depValue)) {
                        // user the property value
                        propertyValue = $(this).attr('property-value');
                    } else {
                        // use the otherwise value
                        propertyValue = $(this).attr('property-otherwise');
                    }

                    // if defined, set property value
                    if (depProperty !== undefined && depProperty !== '') {
                        //required attribute for checkbox group and radio group will go on the parent div since default html5 required behavior validates each individual field rather than the group
                        if ($(this).is('div') && depProperty === 'required') {
                            if (propertyValue === 'required') {
                                $(this).addClass('required');
                            } else {
                                $(this).removeClass('required');
                            }
                        } else {
                            $(this).removeAttr(depProperty);
                            if (propertyValue !== undefined && propertyValue !== '') {
                                $(this).attr(depProperty, propertyValue);
                            }
                        }

                        // else, if defined, set CSS value
                    } else if (depCss !== undefined && depCss !== '') {
                        if (propertyValue !== undefined) {
                            $(this).css(depCss, propertyValue);
                        } else {
                            $(this).css(depCss, '');
                        }
                    }

                    // reset validation for this field
                    if ($(this).is('div')) {
                        $('#form1').data("validator").reset($(this).find('input:first'));
                    } else {
                        $('#form1').data("validator").reset($(this));
                    }
                }
            }
        });
    }
    
    

    /* Setup validator rules */

    $('#form1').unbind('submit');

    $('#form1').validator({
        effect: 'customErrors',
        container: '#formErrors',
        position: 'top left',
        offset: [-12, -40],
        message: '<div><em/></div>' // em element is the arrow
    }).bind("onSuccess", checkNextError);

    function checkNextError(e, els) {
        if ($('#formErrors').css('display') === 'block') {
            var validator = $('#form1').data("validator");
            // unbind the onSuccess event to prevent entering into a loop
            $('#form1').unbind("onSuccess");
            validator.checkValidity();
            validateCheckRadio();
            // rebind the onSuccess event handler
            $('#form1').bind("onSuccess", checkNextError);
        }
    }


    // add custom validator for minimumlength attribute
    $.tools.validator.fn("[minimumlength]", "Please provide at least $1 character$2", function (input) {
        var min = input.attr("minimumlength");
        return input.val().length >= min ? true : (min > 1 ? [min, "s"] : [min, ""]);
    });

    // add custom validator for data-equals attribute (password checker)
    $.tools.validator.fn("[data-equals]", "Value not equal with the $1 field", function (input) {
        var name = input.attr('data-equals'),
                        field = this.getInputs('password').filter("[name=" + name + "]");
        return input.val() === field.val() ? true : [name];
    });


    /* Control the submit event, run validation, and update de doc menu on success */
    $('#form1').submit(function (e) {

        // scroll to top of the page
        $('html, body').animate({ scrollTop: 0 }, 'slow');

        var form = $(this);

        //run check/radio group validation
        var checkRadioValidation = validateCheckRadio();

        // if normal validation is passed
        if (!e.isDefaultPrevented() && checkRadioValidation) {
            $('#loading p').html('Submiting...');
            $('#loading').css('display', 'block');

            $.ajax({
                type: "POST",
                url: "/DocCenter/DocumentFill/SubmitForm",
                data: $("#form1").serialize(),
                success: function (data) {
                    $('#loading').css('display', 'none');
                    $('#loading p').html('Loading...');
                    submitSuccess();

                }
            });
        }
        return false;
    });


    /* Enable dependency validation settings */
    $('.field input, .field select, div.radio-group, div.checkbox-group, .field label').each(function () {
        var depName = $(this).attr('name-dependency'),
            depValue = $(this).attr('value-dependency'),
            depProperty = $(this).attr('property-target'),
            depCss = $(this).attr('css-target');

        // if dependency is defined
        if (depName !== undefined && depName !== '' &&
            depValue !== undefined && depValue !== '' &&
            (depProperty !== undefined && depProperty !== '' || depCss !== undefined && depCss !== '')) {

            //find named field and bind 'change' event handler
            $('.field input[name="' + depName + '"], .field select[name="' + depName + '"]').bind('change textchange', dependencyValidation);

            // run the dependency validation once at the beginning
            $('.field input[name="' + depName + '"], .field select[name="' + depName + '"]').first().each(function () {
                var fieldType = getType($(this));
                if (fieldType === 'checkbox') {
                    $('.field input[name="' + depName + '"][value="' + depValue + '"]').trigger('change');
                } else if (fieldType === 'radio') {
                    // trigger a change event on the selected option, if any
                    var option = $('.field input:checked[name="' + depName + '"]');
                    if (option.length > 0) {
                        option.trigger('change');
                    } else {
                    // otherwise, trigger a change event on any other
                        $('.field input:not(:checked)[name="' + depName + '"]').not($('.field input[name="' + depName + '"][value="' + depValue + '"]')).first().trigger('change');
                    }
                } else if (fieldType === 'text') {
                    $(this).trigger('textchange');
                } else {
                    $(this).trigger('change');
                }
            });
        }
    });



    // Execute jQuery custom code
    jQuery.globalEval($('#custom-code').html());
}

/* Update page and document statuses */
function submitSuccess() {
    var document = $('.selected-page').parent('ol').prev('h3').find('a'),
        docSubmitted = true;

    // set the page status as Filled
    $('.selected-page').find('div:first').removeClass('Unfilled').removeClass('NotApproved').removeClass('DraftSaved').addClass('Filled');

    // determine if all pages of a document are filled or approved
    $('.selected-page').parent('ol').find('li').each(function () {
        if (!($(this).find('div:first').hasClass('Filled') || $(this).find('div:first').hasClass('Approved'))) {
            docSubmitted = false;
        }
    });
    // if so, mark the document as Submitted
    if (docSubmitted) {
        if (document.attr('requires-hard-signature') === 'true') {
            document.find('span').removeClass('Sent PartiallyCompleted Denied Expired').addClass('RequiresHardSignature');
        } else {
            document.find('span').removeClass('Sent PartiallyCompleted Denied Expired').addClass('Submitted');
        }
    }

    // advance to the next page/document or summary
    $('#skip-control').trigger('click');
}

/** Modal confirmation dialog **/
function confirmAction(action, title, message) {
    var confirmDialog = $('#confirm-action');

    if (title === undefined)
        title = 'Confirm';

    if (message !== undefined) {
        confirmDialog.find('.message').html(message).css('display', 'block');
    }
    else confirmDialog.find('.message').html('').css('display', 'none');

    confirmDialog.dialog({
        resizable: false,
        title: title,
        modal: true,
        buttons: {
            Ok: function () {
                $(this).dialog("close");
                action();
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });
}
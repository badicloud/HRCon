/// <reference path="jquery-1.7.1.js"/>
/// <reference path="formsCommon.js"/>
/// <reference path="viewCommon.js"/>
/// <reference path="validationSetup.js"/>

/** Auxiliary global variables **/
var $mainPanel, $documentSection, $pageForm, $pageInstanceSection,
    $welcomeSection, $loadingDialog, $submittingDialog, $printButtons,
    $documentListContainer, $pendingDocumentList, $completedDocumentList, $approvedDocumentList,
    $pendingAmount, $filledAmount, $approvedAmount,  isPrintScript, isPrintImage,
    DOC_MENU_LINKS = 'div.docName',
    DOC_DIV_PREFIX = 'DivDocument-',
    ACTIVE_DOC_CLASS = 'activeDocument',
    NAV_SECTION = 'navSection',
    NAV_LINKS = 'a.navItem',
    SUBMIT_BTTN = 'div.navi div.submitButton',
    DOC_TITLE_PREFIX = 'docTitle-',
    DOC_GROUP_LINK_PREFIX = 'documentGroupLink-',
    DATA_TYPE_NAME = 'data-TypeName',
    DATA_TYPE_ID = 'data-TypeId',
    DOCUMENT_GROUP_SELECTION = 'documentGroupSelection',
    DATA_GROUP_ID = 'data-groupId',
    GROUP_ITEM_PREFIX = 'groupItem-',
    GROUP_DOC_SELECTED_CLASS = 'groupDocSelected',
    CONTINUE_TO_DOC_BUTTON = 'div.continueButton',
    CONTINUE_ENABLED_CLASS = 'continueEnabled',
    DOC_SECTION_PREFIX = 'documentFillPlace-',
    PAGE_FORM_PREFIX = 'pageForm-',
    PAGINATION_PLUGIN = 'paginationPlugin',
    PAGE_COUNT_ATTR = 'data-pageCount',
    IS_READ_ONLY_ATTR = 'data-isReadOnly',
    DOCUMENT_STATUS_ATTR = 'data-documentStatus',
    APPROVED_STATUS = 'Approved',
    UNFILLED_STATUS = 'Unfilled',
    NOTAPROVED_STATUS = 'NotApproved',
    DRAFTSAVED_STATUS = 'DraftSaved',
    FILLED_STATUS = 'Filled',
    EXPIRED_STATUS = 'Expired',
    DENIED_STATUS = 'Denied',
    READONLY_STATUS = 'ReadOnly',
    PARTIALLY_COMPLETED_STATUS = 'PartiallyCompleted',
    SENT_STATUS = 'Sent',
    PENDINGFILE_STATUS = 'PendingFile',
    SUBMITTED_STATUS = 'Submitted',
    PRINT_MESSAGE = 'Your document is being created',
    MAX_PRELOADED_PAGES = 0;


/** Initial setup - event bindings and validation effect and rules **/
$(document).ready(function () {
    // global variables initialization
    $mainPanel = $('#mainPanel');
    $documentSection = $('#panels');
    $pageForm = $('#panels');
    $pageInstanceSection = $('#panels');
    $printButtons = $('.print-button');
    $welcomeSection = $('#welcomeSection');
    $loadingDialog = $('#loading');
    $submittingDialog = $('#submitting');
    $documentListContainer = $('#documentListContainer');
    $pendingDocumentList = $('#pendingDocumentList');
    $completedDocumentList = $('#completedDocumentList');
    $approvedDocumentList = $('#approvedDocumentsList');
    $pendingAmount = $('#pendingDocumentsTitle').find('span');
    $filledAmount = $('#completedDocumentsTitle').find('span');
    $approvedAmount = $('#approvedDocumentsTitle').find('span');

    markSectionAsActive($welcomeSection);

    // setup the print page message
    $printButtons.printPage({
        message: PRINT_MESSAGE
    });

    // setup custom validation errors and localization
    setupValidation();  // validationSetup.js

    // adds an effect called "customErrors" to the validator
    $.tools.validator.addEffect("customErrors", function (errors, event) {

        // get the error messages div
        var wall = $pageInstanceSection.find(this.getConf().container).css('display', 'block'),
            errorIndex = 0,
            maxErrors = 0;

        // remove the previous show all link
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
            // set aux variable to true, to indicate that errors have occurred
            regularValidationErrors = true;
        } else if (regularValidationErrors === true) {
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
        var wall = $pageInstanceSection.find(this.getConf().container).css('display', 'none');
        // remove the class ERROR_FIELD_CLASS from the field
        $.each(inputs, function () {
            $(this).parents(FIELD_CONTAINER).removeClass(ERROR_FIELD_CLASS);
        });
    });
});


//#region Pagination Plugin Setup ---------------------------------------------------------------------------------------------
function handlePaginationClick(new_page_index, pagination_container, current_page) {
    /// <summary>Handles the pagination plugin click event.</summary>
    /// <param name="new_page_index" type="Number">The index of the page that has been selected.</param>
    /// <param name="pagination_container" type="DOM">The pagination container DOM element.</param>
    /// <param name="current_page" type="Number">The index of the page that is currently selected.</param>
    /// <returns type="void"></returns>

    if (new_page_index < current_page) {
        // make the page invisible to disallow the Tab key navigation
        $pageForm.css('display', 'none');
    }

    $($mainPanel.find('#' + NAV_SECTION).find(NAV_LINKS)[new_page_index]).trigger('click');
    return false;
}

function setupPagination() {
    /// <summary>Setups the pagination plugin.</summary>
    /// <returns type="void"></returns>

    var paginationSection = $('#' + PAGINATION_PLUGIN);

    // Check whether the pagination plugin is allready setup
    if (paginationSection.data().current_page == undefined) {

        var pageCount = $mainPanel.find('#' + NAV_SECTION).attr(PAGE_COUNT_ATTR);

        if (paginationSection.attr(IS_READ_ONLY_ATTR) != undefined && paginationSection.attr(IS_READ_ONLY_ATTR) == "true") {
            paginationSection.pagination(pageCount,
            {
                items_per_page: 1,
                load_first_page: false,
                next_text: localizationStrings['Next'],
                prev_text: localizationStrings['Previous'],
                num_edge_entries: 1,
                num_display_entries: 7,
                callback: handlePaginationClick
            });
        } else {
            paginationSection.pagination(pageCount,
            {
                items_per_page: 1,
                load_first_page: false,
                next_text: localizationStrings['Skip'],
                prev_text: localizationStrings['Back'],
                num_edge_entries: 1,
                num_display_entries: 7,
                callback: handlePaginationClick
            });
        }
    }
    
    // reset to the first page using the pagination plugin
    paginationSection.trigger('setPage', [0]);
}
//#endregion


//#region Update Panels Functions ------------------------------------------------------------------------------------------
function refreshPage() {

    showLoadingDialog();
    $.ajax({
        type: "POST",
        url: getFullyQualifiedURL("RefreshPage"),
        success: function (data) {
            if (data.success === true) {
                // replace the document list
                $documentListContainer.html(data.docList);
                // replace the main panel content
                $mainPanel.html(data.content);
                // mark section as active
                markSectionAsActive($welcomeSection);
            } else {
                // notify the user
                showAlert(localizationStrings['LoadingError']);
            }
            // hide loading dialog
            hideLoadingDialog();
        },
        error: function () {
            // hide loading dialog
            hideLoadingDialog();
            // notify the user
            showAlert(localizationStrings['LoadingError']);
        }
    });
}

function refreshDocumentList(documentId) {
    showLoadingDialog();
    $.ajax({
        type: "POST",
        url: getFullyQualifiedURL("RefreshDocumentList"),
        success: function (data) {
            if (data.success === true) {
                // replace the document list
                $documentListContainer.html(data.content);
                // mark the document as the active one
                markSectionAsActive($('#' + documentId));
            } else {
                // notify the user
                showAlert(localizationStrings['LoadingError']);
            }
            // hide loading dialog
            hideLoadingDialog();
        },
        error: function () {
            // hide loading dialog
            hideLoadingDialog();
            // notify the user
            showAlert(localizationStrings['LoadingError']);
        }
    });
}
//#endregion


//#region Document Loading Functions ----------------------------------------------------------------------------------------
function GetDocument(documentId) {

    // scroll to top of the page
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    showLoadingDialog();

    // reset structures
    fieldsDataStructure = {};
    fieldObservers = new Object();

    $.ajax({
        type: "POST",
        url: getFullyQualifiedURL("GetDocument") + '?fillRequestId=' + documentId,
        success: function (data) {
            if (data.success === true) {
                $mainPanel.html(data.content);
                if (data.setup === true) {
                    // setup the horizontal page slider
                    var horizontal = $mainPanel.find("#scrollable").scrollable().navigator({ naviItem: NAV_LINKS });
                    if (horizontal.length > 0) {
                        horizontal.eq(0).data("scrollable").focus();
                    }
                    // setup the pagination plugin
                    setupPagination();
                }
                // mark the document as the active one
                markSectionAsActive($('#' + documentId));
                // hide loading dialog
                hideLoadingDialog();
            } else {
                // hide loading dialog
                hideLoadingDialog();
                // notify the user
                showAlert(localizationStrings['LoadingError']);
            }
        },
        error: function () {
            // hide loading dialog
            hideLoadingDialog();
            // notify the user
            showAlert(localizationStrings['LoadingError']);
        }
    });
}

function GetGroup(groupTypeId) {
    // scroll to top of the page
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    showLoadingDialog();

    $.ajax({
        type: "POST",
        url: getFullyQualifiedURL("GetGroup") + '?groupTypeId=' + groupTypeId,
        success: function (data) {
            if (data.success === true) {
                $mainPanel.html(data.content);
                // mark the group as the active one
                markSectionAsActive($('#' + DOC_GROUP_LINK_PREFIX + groupTypeId));
                // hide loading dialog
                hideLoadingDialog();
            } else {
                // hide loading dialog
                hideLoadingDialog();
                // notify the user
                showAlert(localizationStrings['LoadingError']);
            }
        },
        error: function () {
            // hide loading dialog
            hideLoadingDialog();
            // notify the user
            showAlert(localizationStrings['LoadingError']);
        }
    });
}

function GetDocumentInstance(documentId)
{
    // scroll to top of the page
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    showLoadingDialog();

    // reset structures
    fieldsDataStructure = {};
    fieldObservers = new Object();

    $.ajax({
        type: "POST",
        url: getFullyQualifiedURL("GetDocumentInstance") + '?fillRequestId=' + documentId,
        success: function (data) {
            if (data.success === true) {
                $mainPanel.html(data.content);
                // setup the horizontal page slider
                var horizontal = $mainPanel.find("#scrollable").scrollable().navigator({ naviItem: NAV_LINKS });
                if (horizontal.length > 0) {
                    horizontal.eq(0).data("scrollable").focus();
                }
                // setup the pagination plugin
                setupPagination();
                // mark the document as the active one
                markSectionAsActive($('#' + documentId));
                // hide loading dialog
                hideLoadingDialog();
            } else {
                // hide loading dialog
                hideLoadingDialog();
                // notify the user
                showAlert(localizationStrings['LoadingError']);
            }
        },
        error: function () {
            // hide loading dialog
            hideLoadingDialog();
            // notify the user
            showAlert(localizationStrings['LoadingError']);
        }
    });
}

function showDocumentCompleteSection(documentId) {
    /// <summary>Shows the document complete panel for the specified document ID and makes the title as the ACTIVE one.</summary>
    /// <returns type="void"></returns>

    showLoadingDialog();
    // scroll to top of the page
    $('html, body').animate({ scrollTop: 0 }, 'slow');

    $.ajax({
        type: "POST",
        url: getFullyQualifiedURL("GetDocumentCompleted") + "?fillRequestId=" + documentId,
        success: function (data) {
            if (data.success === true) {
                // insert the page inside the main section
                $mainPanel.html(data.content);
                // hide loading dialog
                hideLoadingDialog();
                // mark the document section as the active one
                markSectionAsActive($('#' + documentId));
            } else {
                // hide loading dialog
                hideLoadingDialog();
                // notify the user
                showAlert(localizationStrings['LoadingError']);
            }
        },
        error: function () {
            // hide loading dialog
            hideLoadingDialog();
            // notify the user
            showAlert(localizationStrings['LoadingError']);
        }
    });
}

function showFaxDocumentLaterSection(FillRequestId) {
    /// <summary>Shows the fax document later panel for the specified document ID.</summary>
    /// <returns type="void"></returns>

    showLoadingDialog();

    $.ajax({
        type: "POST",
        url: getFullyQualifiedURL("GetFaxDocumentLater") + "?FillRequestId=" + FillRequestId,
        success: function (data) {
            // insert the page inside the main section
            $mainPanel.html(data);
            // hide loading dialog
            hideLoadingDialog();
        },
        error: function () {
            // hide loading dialog
            hideLoadingDialog();
            // notify the user
            showAlert(localizationStrings['LoadingError']);
        }
    });
}
//#endregion


//#region Group Type Document Functions ----------------------------------------------------------------------------------------
function selectDocFormGroup(documentId) {
    /// <summary>On the document group page, marks the document as SELECTED,
    /// makes the 'continue to document' button ENABLED,
    /// and binds the onclick event to take the user to the selected document.</summary>
    /// <param name="documentId" type="string">The ID of the document to select.</param>
    /// <returns type="void"></returns>

    var $documentGroupSelection = $('#' + DOCUMENT_GROUP_SELECTION);
    var $docSelection = $documentGroupSelection.find('#' + GROUP_ITEM_PREFIX + documentId);

    if ($docSelection.length > 0) {
        // deselect any previous selected document, and mark the document as selected
        $documentGroupSelection.find('.' + GROUP_DOC_SELECTED_CLASS).removeClass(GROUP_DOC_SELECTED_CLASS);
        $docSelection.addClass(GROUP_DOC_SELECTED_CLASS);

        // update the onclick event handler for the continue button, to take the user to the selected document
        var groupId = $documentGroupSelection.attr(DATA_GROUP_ID);
        var actionOnClick = "GetDocumentInGroup('" + documentId + "', '" + groupId + "')";
        $documentGroupSelection.find(CONTINUE_TO_DOC_BUTTON).attr('onclick', actionOnClick).addClass(CONTINUE_ENABLED_CLASS);
    }
}

function GetDocumentInGroup(documentId, groupTypeId) {

    showLoadingDialog();
    var $documentGroupSelection = $('#' + DOCUMENT_GROUP_SELECTION);
    var $docSelection = $documentGroupSelection.find('#' + GROUP_ITEM_PREFIX + documentId);
    var $groupLink = $documentListContainer.find('#' + DOC_GROUP_LINK_PREFIX + groupTypeId);

    if ($docSelection.length > 0 && $groupLink.length > 0) {

        var newDocTitle = $docSelection.find('p').html();
        var actionOnClick = "GetDocumentInstance('" + documentId + "')";

        // update id, onclick action, title and displayed name on the documents list
        $groupLink.attr('id', documentId)
                  .attr('onclick', actionOnClick);

        $groupLink.find('div')
                .attr('id', DOC_TITLE_PREFIX + documentId)
                .attr('title', newDocTitle)
                .html(newDocTitle);

        // load the selected document
        GetDocumentInstance(documentId);
    } else {
        hideLoadingDialog();
    }
}

function changeDocGroupingSelection(documentId) {
    /// <summary>Updates the id, onclick action, title and display name, to allow the user to change de selection of document in a group.</summary>
    /// <param name="documentId" type="string">The ID of the actual selected document in the gruop.</param>
    /// <returns type="void"></returns>

    showLoadingDialog();
    // find the current document section
    $documentLink = $documentListContainer.find('#' + documentId);
    if ($documentLink.length > 0) {

        var newDocTitle = $documentLink.attr(DATA_TYPE_NAME);
        var groupTypeId = $documentLink.attr(DATA_TYPE_ID);
        var actionOnClick = "GetGroup('" + groupTypeId + "')";

        // update id, onclick action, title and displayed name on the documents list
        $documentLink.attr('id', DOC_GROUP_LINK_PREFIX + groupTypeId)
                  .attr('onclick', actionOnClick);

        $documentLink.find('div')
                .attr('id', DOC_TITLE_PREFIX + groupTypeId)
                .attr('title', newDocTitle)
                .html(newDocTitle);

        // move the group to the pending section if needed
        if (!isDocumentPending(DOC_GROUP_LINK_PREFIX + groupTypeId)) {
            moveToPendingSection(DOC_GROUP_LINK_PREFIX + groupTypeId);
        }

        // load the group document selection page
        GetGroup(groupTypeId);
    } else {
        hideLoadingDialog();
    }
}
//#endregion


//#region Pagination Functions ------------------------------------------------------------------------------------------------
function goNextPage() {
    /// <summary>Changes the scrollable section to display the next page, if there is one.</summary>
    /// <returns type="void"></returns>

    if ($documentSection !== undefined) {
        // advance to the next page using the pagination plugin
        $('#' + PAGINATION_PLUGIN).trigger('nextPage');
    }
}

function goPrevPage() {
    /// <summary>Changes the scrollable section to display the previous page, if there is one.</summary>
    /// <returns type="void"></returns>

    if ($documentSection !== undefined) {
        // advance to the next page using the pagination plugin
        $('#' + PAGINATION_PLUGIN).trigger('prevPage');
    }
}

function skipPage() {
    /// <summary>Changes the scrollable section to display the next page, if there is one, or goes to the complete doc page</summary>
    /// <returns type="void"></returns>

    if ($documentSection !== undefined) {
        var documentId = $documentSection.attr('id').slice(DOC_DIV_PREFIX.length);

        if (isLastDocumentPage()) {
            showDocumentCompleteSection(documentId);
        } else {
            goNextPage();
        }
    }
}
//#endregion


//#region Document pages setup ------------------------------------------------------------------------------------------------
function checkAndLoad(pageId, documentId, href) {
    /// <summary>Checks to see whether the page was already loaded or needs to be loaded and loads it.</summary>
    /// <param name="pageId" type="string">The ID of the page to load.</param>
    /// <param name="documentId" type="string">The ID of the corresponding document.</param>
    /// <param name="href" type="string">The url from where to load the page.</param>
    /// <returns type="void"></returns>

    // show the loading dialog
    showLoadingDialog();

    $documentSection = $('#' + DOC_DIV_PREFIX + documentId);
    $pageInstanceSection = $('#' + DOC_SECTION_PREFIX + pageId);
    $pageForm = $('#' + PAGE_FORM_PREFIX + pageId);

    // load the page only one time
    if ($pageForm.html() === '') {
        $.ajax({
            type: "POST",
            url: href,
            success: function (data) {
                if (data.success === true) {
                    // insert the page inside the form section
                    $pageForm.html(data.content);
                    // setup all the styles and dependency validations
                    setPageSettings($pageForm, $documentSection);

                    // bind the form validations with the submit event
                    setupFormValidationAndSubmit();
                    // make the submit work only for the current page
                    setupSubmitButtonToCurrentPage();

                    // hide the loading dialog
                    hideLoadingDialog();

                    // preload MAX_PRELOADED_PAGES pages
                    preloadDocumentPages(documentId, pageId, MAX_PRELOADED_PAGES);
                } else {
                    // hide the loading dialog
                    hideLoadingDialog();
                    // notify the user
                    showAlert(localizationStrings['LoadPageError']);
                }
            },
            error: function (data) {
                // hide the loading dialog
                hideLoadingDialog();
                // notify the user
                showAlert(localizationStrings['LoadPageError']);
            }
        });
    } else {

        // make the page visible to allow the Tab key navigation
        $pageForm.css('display', '');

        // bind the form validations with the submit event
        setupFormValidationAndSubmit();
        // make the submit work only for the current page
        setupSubmitButtonToCurrentPage();

        // hide the loading dialog
        hideLoadingDialog();

        // preload MAX_PRELOADED_PAGES pages
        preloadDocumentPages(documentId, pageId, MAX_PRELOADED_PAGES);
    }
}

function setPageSettings(pageSection, docSection) {
    /// <summary>Setup all validation rules and settings needed for the page instance.</summary>
    /// <param name="pageSection" type="DOM">The page section.</param>
    /// <param name="docSection" type="DOM">The document section.</param>
    /// <returns type="void"></returns>

    // set fields metadata
    setupMetadata(pageSection);     // viewCommon.js

    // load 'select' fields values from server, when using 'premade fixed' option as source
    loadPremadeValuesForSelectFields(pageSection);  // common.js

    // setup common settings - styles, tooltips, dates, signatures
    setPageCommonSettings(pageSection);  // common.js

    // setup initial values
    setupFieldsValues(pageSection, mergeFieldValuesDictionary);      // viewCommon.js

    //  if the page is already Approved or Expired, disable all fields
    if (docSection.attr(DOCUMENT_STATUS_ATTR) === APPROVED_STATUS || docSection.attr(DOCUMENT_STATUS_ATTR) === EXPIRED_STATUS) {
        pageSection.find(FIELD_CONTAINER).find('input, select').each(function () {
            $(this).attr('disabled', 'disabled');
        });

        pageSection.find(FIELD_CONTAINER + '.' + SIGNATURE_PAD_CLASS).each(function() {
            $(this).data(DATA_SIGNATURE_PAD).disableCanvas();
            $(this).find('span').remove();
            $(this).find('canvas').addClass('disabled');
        });
    }
    
    // setup the custom field validations
    registerCustomValidations(pageSection);  // common.js

    // enable dependency validation settings
    setPageDependencies(pageSection);  // common.js

    // enable checkbox to run the validation when a change event is raised
    setCheckboxChangeEventHandler(pageSection, pageSection.find(ERROR_SECTION), fieldValidationSuccess);  // common.js
    
    // apply uniform plugin to checkboxes and radio buttons
    pageSection.find(CHECKBOX_RADIO_INPUTS).uniform().removeAttr('style');
}

function setupFormValidationAndSubmit() {
    /// <summary>Binds the form validations with the submit event.</summary>
    /// <returns type="void"></returns>

    setPageValidationSettings($pageForm, pageSubmitCustomAction, fieldValidationSuccess);  // common.js
}

function setupSubmitButtonToCurrentPage() {
    /// <summary>Makes the submit button works for the current page.</summary>
    /// <returns type="void"></returns>

    $documentSection.find(SUBMIT_BTTN)
        .unbind('click')
        .bind('click', function () {
            $pageForm.submit();
        });
}

function preloadDocumentPages(documentId, pageId, count) {
    /// <summary>Preloads 'count' number of pages to improve user experience.</summary>
    /// <param name="documentId" type="string">The ID of the corresponding document.</param>
    /// <param name="pageId" type="string">The ID of the loaded page.</param>
    /// <param name="count" type="Number">The number of pages to preload.</param>
    /// <returns type="void"></returns>

    if (count > 0) {

        // look up for the next link using index
        var currentPageLink = $('#' + pageId),
            navigationLinks = currentPageLink.parents('#' + NAV_SECTION).find(NAV_LINKS),
            numberOfPages = navigationLinks.length,
            nextLinkIndex = navigationLinks.index(currentPageLink) + 1,
            nextPageId;

        // check if the next link is a valid page
        if (nextLinkIndex < numberOfPages) {
            nextPageId = $(navigationLinks.get(nextLinkIndex)).attr('id');
            var pageSection = $('#' + PAGE_FORM_PREFIX + nextPageId);
            // if the page is not already loaded
            if (pageSection.html() === '') {
                // load the page
                $.ajax({
                    type: "POST",
                    url: $(navigationLinks.get(nextLinkIndex)).attr('href'),
                    success: function (data) {
                        if (data.success === true) {
                            // insert the page inside the form section
                            pageSection.html(data.content);
                            // setup all the styles and dependency validations
                            setPageSettings(pageSection, $documentSection);

                            // make the page invisible to disallow the Tab key navigation
                            pageSection.css('display', 'none');
                        }
                    }
                });
            }

            // check if it is not the last page
            if (nextLinkIndex + 1 < numberOfPages) {
                // continue loading next pages
                preloadDocumentPages(documentId, nextPageId, count - 1);
            }
        }
    }
}

function fieldValidationSuccess(e, els) {
    /// <summary>Handles the onSuccess event raised by the validator.</summary>
    /// <returns type="void"></returns>

    // checks for the next error to indicate to the user
    checkNextError($pageForm, $pageForm.find(ERROR_SECTION), fieldValidationSuccess); // common.js
}

function pageSubmitCustomAction(form) {
    /// <summary>Custom action to perform when the form is submitted and all validations are passed.</summary>
    /// <param name="form" type="DOM">The form to setup the submit action.</param>
    /// <returns type="void"></returns>

    // show the submitting dialog
    showSubmittingDialog();

    var documentId = $documentSection.attr('id').slice(DOC_DIV_PREFIX.length); // id="DOC_DIV_PREFIX + documentId"

    $.ajax({
        type: "POST",
        url: getFullyQualifiedURL("SubmitForm"),
        data: form.serialize(),
        success: function (data) {
            if (data.success) {
                submitSuccess(documentId);
            } else {
                submitError();
            }
        },
        error: function (data) {
            submitError();
        }
    });
}

function submitSuccess(documentId) {
    /// <summary>Handles the success for a form submit. Updates page and document statuses.</summary>
    /// <param name="documentId" type="string">The ID of the corresponding document.</param>
    /// <returns type="void"></returns>

    hideSubmittingDialog();
    showLoadingDialog();
    
    // remove any remaining tooltip
    $('body div.tooltip').remove();

    var currentPageLink = $documentSection.find('#' + NAV_SECTION).find(NAV_LINKS + '.active'),
        currentPageId = currentPageLink.attr('id');

    // set the page status as Filled
    currentPageLink.parent().removeClass(UNFILLED_STATUS).removeClass(NOTAPROVED_STATUS).removeClass(DRAFTSAVED_STATUS).addClass(FILLED_STATUS);
    // hide any "not approved reason" message
    $pageInstanceSection.find(".notApproved.errorBox").css("display", "none");


    if (!isLastDocumentPage()) {
        // if not yet in the last page of the document advance to the next page
        goNextPage();
    } else {
        // load the document list
        refreshDocumentList(documentId);
        // load the document complete page
        showDocumentCompleteSection(documentId);
    }
}

function submitError() {
    /// <summary>Handles the error for a form submit.</summary>
    /// <returns type="void"></returns>

    // hide the submitting dialog
    hideSubmittingDialog();
    showAlert(localizationStrings['SubmitError']);
}

function submitPageComments(pageInstanceId) {
    var pageComments = $('#' + pageInstanceId + '-comments').find('#UserComments').val().replace(/\n/g, '__XR2_New_Line__');
    if (pageComments !== undefined) {
        $.ajax({
            type: "POST",
            url: getFullyQualifiedURL("SubmitPageComments") + '?pageInstanceId=' + pageInstanceId + '&userComments=' + pageComments,
            success: function (data) {
                if (data.success === true) {
                    showAlert(localizationStrings['SubmitCommentsSuccess']);
                } else {
                    showAlert(localizationStrings['SubmitCommentsError']);
                }
            },
            error: function (data) {
                showAlert(localizationStrings['SubmitCommentsError']);
            }
        });
    }

    // Submit the page - only for readonly documents
    if ($documentSection.attr(DOCUMENT_STATUS_ATTR) === READONLY_STATUS) {
        var serializedComments = $('#' + pageInstanceId + '-comments').find('#UserComments').serialize();
        $.ajax({
            type: "POST",
            url: getFullyQualifiedURL("SubmitForm") + '?pageInstanceId=' + pageInstanceId,
            data: serializedComments,
            error: function (data) {
                showAlert(localizationStrings['SubmitCommentsError']);
            }
        });
    }
}

//#endregion


//#region Upload Document Functions -------------------------------------------------------------------------------------------
function onSuccess(e) {

    // Remove the uploaded file list
    $(this).find("ul").remove();

    var documentId = e.response.fillRequestId;
    // load the document list
    refreshDocumentList(documentId);
    // load the document complete page
    showDocumentCompleteSection(documentId);
}

function onError(e) {
    // Notify the user
    if (e.XMLHttpRequest.response !== undefined) {
        showAlert(e.XMLHttpRequest.response);
    } else if (e.XMLHttpRequest.responseText !== undefined) {
        showAlert(e.XMLHttpRequest.responseText);
    } else {
        showAlert(localizationStrings['UploadError']);
    }
    return false;
}
//#endregion


//#region Dialog Functions -------------------------------------------------------------------------------------------
function showLoadingDialog() {
    $loadingDialog.css('display', 'block');
}

function hideLoadingDialog() {
    $loadingDialog.css('display', 'none');
}

function showSubmittingDialog() {
    $submittingDialog.css('display', 'block');
}

function hideSubmittingDialog() {
    $submittingDialog.css('display', 'none');
}

function showHelpDialog() {

    showLoadingDialog();
    $.ajax({
        type: "GET",
        url: getFullyQualifiedURL("Help"),
        success: function (data) {
            // hide loading dialog
            hideLoadingDialog();
            // show the help dialog
            $(data).dialog({
                modal: true,
                height: 600,
                width: 1010,
                title: localizationStrings['HelpPageTitle']
            });
        },
        error: function () {
            // hide loading dialog
            hideLoadingDialog();
            // notify the user
            showAlert(localizationStrings['LoadingError']);
        }
    });
}

function showOriginalDocument(documentId, docTitle) {

    showLoadingDialog();
    $.ajax({
        type: "POST",
        url: getFullyQualifiedURL("GetFullDocument") + "?documentId=" + documentId,
        success: function (data) {
            if (data.success) {
                $('#originalDocument').html(data.content);
                hideLoadingDialog();
                $('#originalDocument').dialog({
                    modal: true,
                    height: 600,
                    width: 1010,
                    title: capitalize(docTitle)
                });
            } else {
                // hide loading dialog
                hideLoadingDialog();
                // notify the user
                showAlert(localizationStrings['LoadingError']);
            }
        },
        error: function () {
            // hide loading dialog
            hideLoadingDialog();
            // notify the user
            showAlert(localizationStrings['LoadingError']);
        }
    });
}

function showPageComments(pageInstanceId) {

    $('#' + pageInstanceId + '-comments').dialog({
        modal: true,
        height: 200,
        width: 1010,
        title: localizationStrings['PageCommentsTitle'],
        buttons: {
            "Submit comments": function () {
                submitPageComments(pageInstanceId);
                $(this).dialog("close");
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });
}
//#endregion


//#region Auxiliary Functions -------------------------------------------------------------------------------------------------
function isLastDocumentPage() {
    /// <summary>Return whether the current document is on its last page, based on the pagination plugin.</summary>
    /// <returns type="bool"></returns>

    if ($documentSection !== undefined) {
        var currentPage = $('#' + PAGINATION_PLUGIN).data()['current_page'] + 1,
            pageCount = $('#' + PAGINATION_PLUGIN).parent().attr(PAGE_COUNT_ATTR);

        return currentPage.toString() === pageCount;
    }
    return false;
}

function getPendingDocumentIndex(documentId) {
    /// <summary>Return the index of the provided document on the Pending document list.</summary>
    /// <param name="documentId" type="string">The ID of the document to get the index.</param>
    /// <returns type="Number"></returns>

    var pendingDocumentLinks = $pendingDocumentList.find(DOC_MENU_LINKS).children();
    return pendingDocumentLinks.index($('#' + documentId));
}

function isDocumentPending(documentId) {
    /// <summary>Return true if the document is listed on the Pending section.</summary>
    /// <param name="documentId" type="string">The ID of the document to check.</param>
    /// <returns type="bool"></returns>

    return getPendingDocumentIndex(documentId) !== -1;
}

function getSubmittedDocumentIndex(documentId) {
    /// <summary>Return the index of the provided document on the Submitted document list.</summary>
    /// <param name="documentId" type="string">The ID of the document to get the index.</param>
    /// <returns type="Number"></returns>

    var submittedDocumentLinks = $completedDocumentList.find(DOC_MENU_LINKS).children();
    return submittedDocumentLinks.index($('#' + documentId));
}

function isDocumentSubmitted(documentId) {
    /// <summary>Return true if the document is listed on the Submitted section.</summary>
    /// <param name="documentId" type="string">The ID of the document to check.</param>
    /// <returns type="bool"></returns>

    return getSubmittedDocumentIndex(documentId) !== -1;
}

function getApprovedDocumentIndex(documentId) {
    /// <summary>Return the index of the provided document on the Approved document list.</summary>
    /// <param name="documentId" type="string">The ID of the document to get the index.</param>
    /// <returns type="Number"></returns>

    var approvedDocumentLinks = $approvedDocumentList.find(DOC_MENU_LINKS).children();
    return approvedDocumentLinks.index($('#' + documentId));
}

function isDocumentApproved(documentId) {
    /// <summary>Return true if the document is listed on the Approved section.</summary>
    /// <param name="documentId" type="string">The ID of the document to check.</param>
    /// <returns type="bool"></returns>

    return getApprovedDocumentIndex(documentId) !== -1;
}

function markSectionAsActive(section) {
    /// <summary>Mark the specified section as the active one.</summary>
    /// <param name="section" type="DOM">The DOM element section to set as active.</param>
    /// <returns type="void"></returns>

    if ($(section).length > 0) {
        // remove the ACTIVE class from the current section
        $('.' + ACTIVE_DOC_CLASS).removeClass(ACTIVE_DOC_CLASS);
        // set the ACTIVE class to the new section
        $(section).addClass(ACTIVE_DOC_CLASS);
    }
}

function moveToPendingSection(documentId) {
    /// <summary>Moves a document from the submitted or approved sections to the Pending section.</summary>
    /// <param name="documentId" type="string">The ID of the document to move.</param>
    /// <returns type="bool"></returns>

    var documentLink = $documentListContainer.find('#' + documentId);
    var isSubmitted = isDocumentSubmitted(documentId);
    if (isSubmitted || isDocumentApproved(documentId)) {
        
        // Update the Pending amount
        $pendingAmount.html(parseInt($pendingAmount.html()) + 1);

        if (isSubmitted) {
            // Update the Submitted amount
            $filledAmount.html(parseInt($filledAmount.html()) - 1);
        } else {
            // Update the Approved amount
            $approvedAmount.html(parseInt($approvedAmount.html()) - 1);
        }

        // Remove it from the current section, and move it to the Pending one
        documentLink.parents(DOC_MENU_LINKS).appendTo($pendingDocumentList);
    }
}

function capitalize(str) {
    strVal = '';
    strVal += str.substring(0, 1).toUpperCase() + str.substring(1, str.length);
    return strVal
}
//#endregion



function bindPageComplete() {
    isPrintScript = false;
    isPrintImage = false;
    $('#printPage')[0].contentWindow.$printDocument.bind('processingPage', function (ev, page) { updateMessage('Processing page ' + page + '....'); });
    $('#printPage')[0].contentWindow.$printDocument.bind('printPageComplete', function () { updateMessage('Document processed. Loading images.'); isPrintScript = true; checkPrintStatus(); printit(); });
}

function updateMessage(message) {
    $("#printMessageBox").html(message);
}

function printit() {
    if (CheckIsIE()) {
        document.printPage.focus();
        document.printPage.print();
    } else {
        frames["printPage"].focus();
        frames["printPage"].print();
    }
}

function CheckIsIE() {
    var navName = navigator.appName.toUpperCase();
    if (navName == 'MICROSOFT INTERNET EXPLORER')
    { return true; }
    else
    { return false; }
}

function unloadMessage() {
    $("#printMessageBox").delay(500).animate({ opacity: 0 }, 100, function () {
        $(this).remove();
    });
}

function setPrintImagesReady() {
    isPrintImage = true;
    checkPrintStatus();
}

function checkPrintStatus() {
    if (isPrintImage && isPrintScript) {
        unloadMessage();
    }
}
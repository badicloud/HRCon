/// <reference path="jquery-1.7.1.js"/>
/// <reference path="formsCommon.js"/>
/// <reference path="viewCommon.js"/>
/// <reference path="printCommon.js"/>

var $documentSection; // needed for the dependency function in common.js
var $printDocument = $(document);
var currentPage = 0;


$(document).ready(function () {
    $printDocument = $(document);

    // when accessing the page individually, use:
    // parent.bindPageComplete = function () { }
    // to avoid the page to crash
    parent.bindPageComplete();
    if (Object.keys(documentPages).length > 0) {
        setupInterval = setInterval(loadPage, 100);
    }
});

function loadPage() {
    clearInterval(setupInterval);

    var pageId = Object.keys(documentPages)[0];
    delete documentPages[pageId];
    currentPage++;
    $printDocument.trigger('processingPage', [currentPage]);

    // setup every single page
    setPage($('#' + pageId));   // printCommon.js

    if (Object.keys(documentPages).length > 0) {
        setupInterval = setInterval(loadPage, 100);
    } else {
        setupInterval = setInterval(replaceInputs, 100);
    }
}

function replaceInputs() {
    clearInterval(setupInterval);

    transformInputsToText();    // printCommon.js

    $printDocument.trigger('printPageComplete');
}
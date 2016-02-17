/// <reference path="jquery-1.7.1.js"/>
/// <reference path="formsCommon.js"/>
/// <reference path="viewCommon.js"/>
/// <reference path="printCommon.js"/>

var $documentSection; // needed for the dependency function in common.js
var $printDocument = $(document);

$(document).ready(function () {
    $printDocument = $(document);

    // setup every single page
    $('.singlePage').each(function () {
        setPage($(this));       // printCommon.js
    });

    transformInputsToText();    // printCommon.js

    setTimeout(myfunction, 100);
});

function myfunction() {
    $printDocument.trigger('printPageComplete');
}
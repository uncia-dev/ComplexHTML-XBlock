/* Javascript for CDOTSlideXBlock. */
function CDOTSlidesXBlock(runtime, element) {

var CKEditor_URL = "http://127.0.0.1:1080/lib/js/ckeditor/ckeditor.js";

// Return class name, id or type depending on which one is available first
function getid(element) {
    var id = element.className;
    if (id === "") id = element.id;
    if (id === "") id = element.type;
    return id;
}

// Record clicks on input objects
$('input', element).click(function (eventObject) {
    // for now apply this only on buttons
    if (this.type == "button") {
        $.ajax({
            type: "POST",
            url: runtime.handlerUrl(element, 'grab_data'),
            data: JSON.stringify({"id": getid(this), "action": this.type + "_click"}),
            success: console.log("- clicked on " + this.className)
        });
    }
});

// Record link clicks
$('a', element).click(function (eventObject) {
    $.ajax({
        type: "POST",
        url: runtime.handlerUrl(element, 'grab_data'),
        data: JSON.stringify({"id": getid(this),"action": this.type + "_click"}),
        success: console.log("- clicked on " + this.className)
    });
});

    // TODO: Process JSON code passed from Studio view for Paul's JavaScript module
    // TODO Remove code below at the end of development


// Attach CKEditor to HTML input textarea
if (CKEditor_URL.endsWith("ckeditor.js")) {
    $.getScript(CKEditor_URL, function () { CKEDITOR.replace('dev_body_html'); });
}

// Attach CodeMirror to JavaScript, JSON and CSS fields
var codemirror_settings = {
    lineNumbers: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    theme: "ambiance",
    extraKeys: {
    "F11": function(cm) {
      cm.setOption("fullScreen", !cm.getOption("fullScreen"));
    },
    "Esc": function(cm) {
      if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
    }}
};

var editor_js = CodeMirror.fromTextArea($('.dev_body_js')[0],
    jQuery.extend({mode: {name: "javascript", globalVars: true}}, codemirror_settings)
);

var editor_json = CodeMirror.fromTextArea($('.dev_body_json')[0],
    jQuery.extend({mode: {name: "javascript", globalVars: true, json: true}}, codemirror_settings)
);

var editor_css = CodeMirror.fromTextArea($('.dev_body_css')[0],
    jQuery.extend({mode: {name: "css", globalVars: true}}, codemirror_settings)
);

/* Page is loaded. Do something. */
$(function ($) {

    /* FOR DEVELOPMENT */
    $('.btn_cdot_toggle_visibility').click(function (eventObject) {
        $(this).hide();
        $('.cdot_slides_for_edx_block_dev').show();
    });

    $('.btn_submit').click(function (eventObject) {

        $.ajax({
            type: "POST",
            url: runtime.handlerUrl(element, 'studio_submit'),
            data: JSON.stringify({
                "display_name": $('.dev_display_name').val(),
                "body_html":
                    (CKEditor_URL.endsWith("ckeditor.js")) ?
                        CKEDITOR.instances.dev_body_html.getData() : $('.dev_body_html').val(),
                "body_js": editor_js.getDoc().getValue(), // : $('.dev_body_js').val(),
                "body_json": editor_json.getDoc().getValue(), // : $('.dev_body_json').val(),
                "body_css": editor_css.getDoc().getValue() // : $('.dev_body_css').val()
            })
        });

        setTimeout(function () {
            location.reload();
        }, 2000); // intentional wait time to see the console

    });

    /* FOR DEVELOPMENT */

/* Staff entered JS code goes below */


})

}
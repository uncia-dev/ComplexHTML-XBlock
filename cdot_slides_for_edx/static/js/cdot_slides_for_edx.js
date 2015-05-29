/* Javascript for CDOTSlideXBlock. */
function CDOTSlidesXBlock(runtime, element) {

var json_settings = {};

$.ajax({
    type: "POST",
    url: runtime.handlerUrl(element, 'get_body_json'),
    data: JSON.stringify({}),
    success: function(result) { json_settings = JSON.parse(result.body_json); }
});

// Record an element click to the student's database entry
function recordClick(rec, type) {

    $(rec, element).click(

        function (eventObject) {

            var id = this.tagName;
            if (this.type != undefined) id = this.type;
            if (this.id != "") id = this.id;
            if (this.className != "" ) id = this.className;

            if (this.type === type || type === undefined) {
                $.ajax({
                    type: "POST",
                    url: runtime.handlerUrl(element, 'grab_data'),
                    data: JSON.stringify({"id": id, "action": ((this.type != undefined) ? this.type : this.tagName) + "_click"})
            });}

        });

}

// TODO Remove code below at the end of development

// Attach CodeMirror to JavaScript, JSON and CSS fields
var codemirror_settings = {
    lineNumbers: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    theme: "mdn-like",
    extraKeys: {
    "F11": function(cm) {
      cm.setOption("fullScreen", !cm.getOption("fullScreen"));
    },
    "Esc": function(cm) {
      if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
    }}
};

var editor_dev_tracked = CodeMirror.fromTextArea($('.dev_body_tracked')[0],
    codemirror_settings
);
editor_dev_tracked.setSize("100%", 120);

var editor_dev_js = CodeMirror.fromTextArea($('.dev_body_js')[0],
    jQuery.extend({mode: {name: "javascript", globalVars: true}}, codemirror_settings)
);

var editor_dev_json = CodeMirror.fromTextArea($('.dev_body_json')[0],
    jQuery.extend({mode: {name: "javascript", globalVars: true, json: true}}, codemirror_settings)
);

var editor_dev_css = CodeMirror.fromTextArea($('.dev_body_css')[0],
    jQuery.extend({mode: {name: "css", globalVars: true}}, codemirror_settings)
);

var CKeditor_dev_URL = "http://127.0.0.1:1080/lib/js/ckeditor/ckeditor.js";

// Attach CKEditor or CodeMirror (as fallback) to HTML input textarea
if (CKeditor_dev_URL.endsWith("ckeditor.js")) {
    $.getScript(CKeditor_dev_URL, function () {
        CKEDITOR.replace('dev_body_html');
        CKEDITOR.config.height = 400;
    });
} else {
    var editor_dev_html = CodeMirror.fromTextArea($('.dev_body_html')[0],
        jQuery.extend({mode: {name: "htmlmixed", globalVars: true}}, codemirror_settings)
    );
}

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
                    (CKeditor_dev_URL.endsWith("ckeditor.js")) ?
                        CKEDITOR.instances.dev_body_html.getData() : editor_dev_html.getDoc().getValue(),
                "body_tracked": editor_dev_tracked.getDoc().getValue(),
                "body_js": editor_dev_js.getDoc().getValue(),
                "body_json": editor_dev_json.getDoc().getValue(),
                "body_css": editor_dev_css.getDoc().getValue()
            })
        });

        setTimeout(function () {
            location.reload();
        }, 2000); // intentional wait time to see the console

    });

    /* FOR DEVELOPMENT */
/* Elements being recorded go here */

/* Staff entered JS code goes below */


})

}
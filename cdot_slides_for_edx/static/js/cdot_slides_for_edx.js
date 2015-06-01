/* Javascript for CDOTSlideXBlock. */
function CDOTSlidesXBlock(runtime, element) {

    var json_settings = {};
    /* Used during development
    // Manually set this to where you store CKEditor
    var CKEditor_URL = "";
    var codemirror_settings = {
        lineNumbers: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        theme: "mdn-like"
    };
    */

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

    // Load JSON settings from database
    $.ajax({
        type: "POST",
        url: runtime.handlerUrl(element, 'get_json_settings'),
        data: JSON.stringify({}),
        success: function(result) {
            if (result.json_settings != "") json_settings = JSON.parse(result.json_settings);
        }
    });

    /* Used during development
    // Attach CKEditor or CodeMirror (as fallback) to HTML input textarea
    if (CKeditor_dev_URL.endsWith("ckeditor.js")) {
        console.log("Loading CKEditor.");
        $.getScript(CKeditor_dev_URL, function () {
            CKEDITOR.replace('dev_body_html');
            CKEDITOR.config.height = 600;
        });
    } else {
        console.log("CKEditor script not located. Loading CodeMirror instead.");
        var editor_dev_html = CodeMirror.fromTextArea($('.dev_body_html')[0],
            jQuery.extend({mode: {name: "htmlmixed", globalVars: true}}, codemirror_settings)
        );
    }

    var editor_dev_tracked = CodeMirror.fromTextArea($('.dev_body_tracked')[0],
        codemirror_settings
    );
    editor_dev_tracked.setSize("100%", 120);

    var editor_dev_js = CodeMirror.fromTextArea($('.dev_body_js')[0],
        jQuery.extend({mode: {name: "javascript", globalVars: true}}, codemirror_settings)
    );
    editor_dev_js.setSize("100%", 600);

    var editor_dev_json = CodeMirror.fromTextArea($('.dev_body_json')[0],
        jQuery.extend({mode: {name: "javascript", globalVars: true, json: true}}, codemirror_settings)
    );
    editor_dev_json.setSize("100%", 200);

    var editor_dev_css = CodeMirror.fromTextArea($('.dev_body_css')[0],
        jQuery.extend({mode: {name: "css", globalVars: true}}, codemirror_settings)
    );
    editor_dev_css.setSize("100%", 600);
    */

/* Page is loaded. Do something. */
$(function ($) {

    /* Used during development
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
    */

/* Elements being recorded go here */

/* Staff entered JS code goes below */


})

}
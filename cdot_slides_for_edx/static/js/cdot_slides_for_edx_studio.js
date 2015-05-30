/* Javascript for CDOTSlideXBlock, Studio Side. */
function CDOTSlidesXBlockStudio(runtime, element) {

    /* Update fields of the form to the current values */
    function formUpdate(data) {

        $(".cdot_display_name").val(data.display_name);
        $(".cdot_body_html").val(data.body_html);
        $(".cdot_body_js").val(data.body_js);
        $(".cdot_body_json").val(data.body_json);
        $(".cdot_body_css").val(data.body_css);

    }

    // Attach CodeMirror to JavaScript, JSON and CSS fields
    var codemirror_settings = {
        lineNumbers: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        theme: "mdn-like"
    };

    var editor_tracked = CodeMirror.fromTextArea($('.cdot_body_tracked')[0],
        codemirror_settings
    );
    editor_tracked.setSize("100%", 120);

    var editor_js = CodeMirror.fromTextArea($('.cdot_body_js')[0],
        jQuery.extend({mode: {name: "javascript", globalVars: true}}, codemirror_settings)
    );
    editor_js.setSize("100%", 600);

    var editor_json = CodeMirror.fromTextArea($('.cdot_body_json')[0],
        jQuery.extend({mode: {name: "javascript", globalVars: true, json: true}}, codemirror_settings)
    );
    editor_json.setSize("100%", 200);

    var editor_css = CodeMirror.fromTextArea($('.cdot_body_css')[0],
        jQuery.extend({mode: {name: "css", globalVars: true}}, codemirror_settings)
    );
    editor_css.setSize("100%", 600);

    var CKEditor_URL = "http://127.0.0.1:1080/lib/js/ckeditor/ckeditor.js";

    // Attach CKEditor or CodeMirror (as fallback) to HTML input textarea
    if (CKEditor_URL.endsWith("ckeditor.js")) {
        $.getScript(CKEditor_URL, function () {
            CKEDITOR.replace('cdot_body_html');
            CKEDITOR.config.height = 600;
        });
    } else {
        var editor_html = CodeMirror.fromTextArea($('.cdot_body_html')[0],
            jQuery.extend({mode: {name: "htmlmixed", globalVars: true}}, codemirror_settings)
        );
    }

    /* Page is loaded. Do something. */
    $(function($) {

        // Override default Studio styling such that it fits the entire window and disables the main scrollbar
        $('.modal-window').hover(function() {

            $('.modal-window').css({"top": "0px", "left": "0px", "width": "100%"});
            $('.modal-content').css({"height": "100%"});

        });

        // Add Save and Reload Button
        $("ul", ".modal-actions")//.empty()
            .append(
                    $("<li>", {class: "action-item"}).append(
                        $("<a />", {class: "action-primary", id: "btn_submit", text: "Save"})
                    )
            );

        // Clicked Submit
        $('#btn_submit').click(function(eventObject) {

            $.ajax({
                type: "POST",
                url: runtime.handlerUrl(element, 'studio_submit'),
                data: JSON.stringify({
                    "display_name": $('.cdot_display_name').val(),
                    "body_html":
                        (CKEditor_URL.endsWith("ckeditor.js")) ?
                            CKEDITOR.instances.cdot_body_html.getData() : editor_html.getDoc().getValue(),
                    "body_tracked": editor_tracked.getDoc().getValue(),
                    "body_js": editor_js.getDoc().getValue(),
                    "body_json": editor_json.getDoc().getValue(),
                    "body_css": editor_css.getDoc().getValue()
                }),
                success: formUpdate
            });

            setTimeout(function(){location.reload();},200);

        });

    });

}
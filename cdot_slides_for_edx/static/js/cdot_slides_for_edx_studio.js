/* Javascript for CDOTSlideXBlock. */
function CDOTSlidesXBlockStudio(runtime, element) {

    /* Update fields of the form to the current values */
    function formUpdate(data) {

        $(".cdot_display_name").val(data.display_name);
        $(".cdot_body_html").val(data.body_html);
        $(".cdot_body_js").val(data.body_js);
        $(".cdot_body_json").val(data.body_json);
        $(".cdot_body_css").val(data.body_css);

    }

    // Load CKEditor and attach it to relevant text areas
    // MANUALLY SET THE URL BELOW IF YOU WISH, OR DISABLE IT
    var CKEditor_URL = "http://127.0.0.1:1080/lib/js/ckeditor/ckeditor.js";
    if (CKEditor_URL.endsWith("ckeditor.js")) {

        $.getScript(CKEditor_URL, function () {
            CKEDITOR.replace('cdot_body_html');
        });

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

    var editor_js = CodeMirror.fromTextArea($('.cdot_body_js')[0],
        jQuery.extend({mode: {name: "javascript", globalVars: true}}, codemirror_settings)
    );

    var editor_json = CodeMirror.fromTextArea($('.cdot_body_json')[0],
        jQuery.extend({mode: {name: "javascript", globalVars: true, json: true}}, codemirror_settings)
    );

    var editor_css = CodeMirror.fromTextArea($('.cdot_body_css')[0],
        jQuery.extend({mode: {name: "css", globalVars: true}}, codemirror_settings)
    );

    /* Page is loaded. Do something. */
    $(function($) {

        // Add personal save button
        $(".modal-actions")//.empty()
            .append(
                    $("<input />", {type: "button", class: "btn_submit", value: "Save and Reload"})
            );

        // Clicked Submit
        $('.btn_submit').click(function(eventObject) {

            $.ajax({
                type: "POST",
                url: runtime.handlerUrl(element, 'studio_submit'),
                data: JSON.stringify({
                    "display_name": $('.cdot_display_name').val(),
                    "body_html":
                        (CKEditor_URL.endsWith("ckeditor.js")) ?
                        CKEDITOR.instances.cdot_body_html.getData() :
                        $('.dev_body_html').val(),
                    "body_js": $('.cdot_body_js').val(),
                    "body_json": $('.cdot_body_json').val(),
                    "body_css": $('.cdot_body_css').val()
                }),
                success: formUpdate
            });

            setTimeout(function(){location.reload();},200);

        });

    });

}
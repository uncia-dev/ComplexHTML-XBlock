/* Javascript for CDOTSlideXBlock, Studio Side. */
function CDOTSlidesXBlockStudio(runtime, element) {

    var isFullscreen = false;
    var sHeight = 0.88 * $(window).height();
    var sWidth = "70%";
    var sTop = "0%";
    var sLeft = "15%";

    // Manually set this to where you store CKEditor
    var CKEditor_URL = "";

    var codemirror_settings = {
        lineNumbers: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        theme: "mdn-like"
    };

    // Attach CKEditor or CodeMirror (as fallback) to HTML input textarea
    if (CKEditor_URL.endsWith("ckeditor.js")) {
        console.log("Loading CKEditor.");
        $.getScript(CKEditor_URL, function () {
            CKEDITOR.replace('cdot_body_html');
            CKEDITOR.config.height = 600;
        });
    } else {
        console.log("CKEditor script not located. Loading CodeMirror instead.");
        var editor_html = CodeMirror.fromTextArea($('.cdot_body_html')[0],
            jQuery.extend({mode: {name: "htmlmixed", globalVars: true}}, codemirror_settings)
        );
    }

    // Attach CodeMirror to JavaScript, JSON and CSS fields
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

    // Adjust Editor dialog to fit the entire window
    function xblock_maximize() {
        isFullscreen = true;
        $('.modal-window').css({"top": "0px", "left": "0px", "width": "100%"});
        $('.modal-content').css({"height": sHeight});
    }

    // Adjust Editor dialog to edX's standard settings
    function xblock_minimize() {
        isFullscreen = false;
        $('.modal-window').css({"top": sTop, "left": sLeft, "width": sWidth});
        $('.modal-content').css({"height": sHeight});
    }

    // Refresh Editor dimensions
    function xblock_refresh() {
        if (isFullscreen) xblock_maximize();
        else xblock_minimize();
    }

    $(function($) {

        // Add Save Button
        $('ul', '.modal-actions')
            .append(
                $('<li>', {class: "action-item"}).append(
                    $('<a />', {class: "action-primary", id: "btn_submit", text: "Save"})
                )
            );

        // Add Fullscreen Button
        $('.editor-modes')
            .append(
                $('<li>', {class: "action-item"}).append(
                    $('<a />', {class: "action-primary", id: "btn_fullscreen", text: "Fullscreen"})
                )
            );

        // Readjust settings in case the window is resized
        window.addEventListener('resize', function(event){
            if (!isFullscreen) xblock_minimize();
            else xblock_maximize();
        });

        // Fill the window with the Editor view
        $('#btn_fullscreen').click(function() {
            if (!isFullscreen) xblock_maximize();
            else xblock_minimize();
        });

        function toggle_pane(t) {
            $('.csx_options').hide();
            $('.csx_html').hide();
            $('.csx_javascript').hide();
            $('.csx_css').hide();
            $('.csx_preview').hide();
            $(t).show();
            xblock_refresh();
        }

        $('#csx_options').click(function() {
            toggle_pane(".csx_options");
        });

        $('#csx_html').click(function() {
            toggle_pane(".csx_html");
        });

        $('#csx_javascript').click(function() {
            toggle_pane(".csx_javascript");
        });

        $('#csx_css').click(function() {
            toggle_pane(".csx_css");
        });

        $('#csx_preview').click(function() {
            toggle_pane(".csx_preview");
        });

        // Clicked Save button
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
                })
            });

            setTimeout(function(){location.reload();},200);

        });

    });

}

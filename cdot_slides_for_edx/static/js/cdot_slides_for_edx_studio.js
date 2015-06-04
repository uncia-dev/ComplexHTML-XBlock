/* Javascript for CDOTSlideXBlock, Studio Side. */
function CDOTSlidesXBlockStudio(runtime, element) {

    var isFullscreen = false;
    var sHeight = 0;
    var sWidth = "70%";
    var sTop = "15.5%";
    var sLeft = "15%";
    var csxColor = ["#009FE6", "black"];

    // Manually set this to where you store CKEditor
    var CKEditor_URL = "";

    var codemirror_settings = {
        lineNumbers: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        lineWrapping: true,
        theme: "mdn-like"
    };

    var studio_buttons = {
        "csx_options": "Options",
        "csx_preview": "Preview",
        "csx_html": "HTML",
        "csx_javascript": "JavaScript",
        "csx_css": "CSS",
        "csx_fullscreen": "Fullscreen"
    };

    // Attach CKEditor or CodeMirror (as fallback) to HTML input textarea
    if (CKEditor_URL.endsWith("ckeditor.js")) {
        console.log("Loading CKEditor.");
        $.getScript(CKEditor_URL, function () {
            CKEDITOR.replace('cdot_body_html');
            CKEDITOR.config.height = 340;
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

    var editor_js = CodeMirror.fromTextArea($('.cdot_body_js')[0],
        jQuery.extend({mode: {name: "javascript", globalVars: true}}, codemirror_settings)
    );

    var editor_json = CodeMirror.fromTextArea($('.cdot_body_json')[0],
        jQuery.extend({mode: {name: "javascript", globalVars: true, json: true}}, codemirror_settings)
    );

    var editor_css = CodeMirror.fromTextArea($('.cdot_body_css')[0],
        jQuery.extend({mode: {name: "css", globalVars: true}}, codemirror_settings)
    );

    // Adjust Editor dialog to fit the entire window
    function xblock_maximize() {
        isFullscreen = true;
        $('.modal-window').css({"top": "0px", "left": "0px", "width": "100%"});
        $('.modal-content').css({"height": 0.865 * $(window).height()});
        if (!CKEditor_URL.endsWith("ckeditor.js")) editor_html.setSize("100%", 0.8 * $(window).height());
        editor_tracked.setSize("100%", 120);
        editor_js.setSize("100%", 0.8 * $(window).height());
        editor_json.setSize("100%", 230);
        editor_css.setSize("100%", 0.8 * $(window).height());
        $('#csx_fullscreen').css({"color": csxColor[1]});
    }

    // Adjust Editor dialog to edX's standard settings
    function xblock_minimize() {
        isFullscreen = false;
        $('.modal-window').css({"top": sTop, "left": sLeft, "width": sWidth});
        $('.modal-content').css({"height": 0.6 * $(window).height()});
        if (!CKEditor_URL.endsWith("ckeditor.js")) editor_html.setSize("100%", 370);
        editor_tracked.setSize("100%", 120);
        editor_js.setSize("100%", 370);
        editor_json.setSize("100%", 230);
        editor_css.setSize("100%", 370);
        $('#csx_fullscreen').css({"color": csxColor[0]});
    }

    // Refresh Editor dimensions
    function xblock_refresh() {
        if (isFullscreen) xblock_maximize();
        else xblock_minimize();
    }

    function tab_highlight(toHighlight) {
        for (var b in studio_buttons) {
            if (b != "csx_fullscreen") $("#" + b).css({"color": csxColor[0]});
        }
        $("#" + toHighlight).css({"color": csxColor[1]});
    }

    // Hide all panes except toShow
    function tab_switch(toShow) {
        tab_highlight(toShow);
        for (var b in studio_buttons) $("." + b).hide();
        $("." + toShow).show();
        xblock_refresh();
    }

    $(function($) {

        // Add Save Button
        $('ul', '.modal-actions')
            .append(
                $('<li>', {class: "action-item"}).append(
                    $('<a />', {class: "action-primary", id: "btn_submit", text: "Save"})
                )
            );

        for (var b in studio_buttons) {
            $('.editor-modes')
                .append(
                    $('<li>', {class: "action-item"}).append(
                        $('<a />', {class: "action-primary", id: b, text: studio_buttons[b]})
                    )
                );
        }

        // Set main pane to Options
        tab_switch("csx_options");
        // Adjust the modal window
        xblock_minimize();
        // Readjust modal window dimensions in case the browser window is resized
        window.addEventListener('resize', xblock_refresh());

        $('#csx_options').click(function() {
            tab_switch("csx_options");
        });

        $('#csx_preview').click(function() {
            tab_switch("csx_preview");
        });

        $('#csx_html').click(function() {
            tab_switch("csx_html");
        });

        $('#csx_javascript').click(function() {
            tab_switch("csx_javascript");
        });

        $('#csx_css').click(function() {
            tab_switch("csx_css");
        });

        // Fill the window with the Editor view
        $('#csx_fullscreen').click(function() {
            isFullscreen = !isFullscreen;
            xblock_refresh();
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

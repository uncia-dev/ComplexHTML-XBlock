/* JavaScript for ComplexHTML XBlock, Studio Side. */
function ComplexHTMLXBlockStudio(runtime, xblock_element) {

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
        "chx_options": "Options",
        "chx_preview": "Preview",
        "chx_html": "HTML",
        "chx_javascript": "JavaScript",
        "chx_css": "CSS",
        "chx_fullscreen": "Fullscreen"
    };

    var ckeditor_html = "";
    var editor_html = "";

    // Attach CKEditor or CodeMirror (as fallback) to HTML input textarea
    if (CKEditor_URL.endsWith("ckeditor.js")) {
        $.getScript(CKEditor_URL, function () {
            ckeditor_html = CKEDITOR.replace('chx_body_html');
            ckeditor_html.config.height = "auto";
            ckeditor_html.config.width = "auto";
        });
    } else {
        editor_html = CodeMirror.fromTextArea($('.chx_body_html')[0],
            jQuery.extend({mode: {name: "htmlmixed", globalVars: true}}, codemirror_settings)
        );
    }

    // Attach CodeMirror to JavaScript, JSON and CSS fields
    var editor_tracked = CodeMirror.fromTextArea($('.chx_body_tracked')[0],
        codemirror_settings
    );

    var editor_js = CodeMirror.fromTextArea($('.chx_body_js')[0],
        jQuery.extend({mode: {name: "javascript", globalVars: true}}, codemirror_settings)
    );

    var editor_json = CodeMirror.fromTextArea($('.chx_body_json')[0],
        jQuery.extend({mode: {name: "javascript", globalVars: true, json: true}}, codemirror_settings)
    );

    var editor_css = CodeMirror.fromTextArea($('.chx_body_css')[0],
        jQuery.extend({mode: {name: "css", globalVars: true}}, codemirror_settings)
    );

    // Adjust Editor dialog to fit the entire window
    function xblock_maximize() {
        isFullscreen = true;
        $('.modal-window').css({"top": "0px", "left": "0px", "width": "100%"});
        $('.modal-content').css({"height": 0.865 * $(window).height()});
        if (ckeditor_html != "") ckeditor_html.resize("100%", 0.83 * $(window).height());
        if (editor_html != "") editor_html.setSize("100%", 0.83 * $(window).height());
        editor_tracked.setSize("100%", 120);
        editor_js.setSize("100%", 0.83 * $(window).height());
        editor_json.setSize("100%", 230);
        editor_css.setSize("100%", 0.83 * $(window).height());
        $('#chx_fullscreen').css({"color": csxColor[1]});
    }

    // Adjust Editor dialog to edX's standard settings
    function xblock_minimize() {
        isFullscreen = false;
        $('.modal-window').css({"top": sTop, "left": sLeft, "width": sWidth});
        $('.modal-content').css({"height": 0.6 * $(window).height()});
        if (ckeditor_html != "") ckeditor_html.resize("100%", 0.82 * $(window).height());
        if (editor_html != "") editor_html.setSize("100%", 0.82 * $(window).height());
        editor_tracked.setSize("100%", 120);
        editor_js.setSize("100%", $(window).height() * 0.55);
        editor_json.setSize("100%", 230);
        editor_css.setSize("100%", $(window).height() * 0.55);
        $('#chx_fullscreen').css({"color": csxColor[0]});
    }

    // Refresh Editor dimensions
    function xblock_refresh() {
        if (isFullscreen) xblock_maximize();
        else xblock_minimize();
    }

    function tab_highlight(toHighlight) {
        for (var b in studio_buttons) {
            if (b != "chx_fullscreen") $("#" + b).css({"color": csxColor[0]});
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

    // Generate a preview of the slide based on the HTML, JS and CSS code written so far
    function preview_slide() {

        var prev = "";

        // Generate CSS for the preview block and append it
        $.ajax({
            type: "POST",
            url: runtime.handlerUrl(xblock_element, 'get_generated_css'),
            data: JSON.stringify({
                "css": editor_css.getDoc().getValue(),
                "block": ".chx_preview"
            }),
            success: function(result) {
                prev += "<style>" + result.css + "</style>";
            },
            async: false
        });

        // Append HTML code to preview block
        prev += (ckeditor_html != "") ? ckeditor_html.getData() : editor_html.getDoc().getValue();

        $(".chx_preview").empty().append(prev);

        // remove old JS preview code
        $("#chx_preview_script").remove();

        //var json_settings = JSON.parse(editor_json.getDoc().getValue());
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.id = "chx_preview_script";
        script.text =
                "json_settings = JSON.parse(\'" +
                editor_json.getDoc().getValue()  +
                "\');\n" +
                editor_js.getDoc().getValue();

        document.head.appendChild(script);

    }

    $(function($) {

        // Add Save Button
        $('ul', '.modal-actions')
            .append(
                $('<li>', {class: "action-item"}).append(
                    $('<a />', {class: "action-primary", id: "chx_submit", text: "Save"})
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
        tab_switch("chx_options");
        // Adjust the modal window
        xblock_minimize();
        // Readjust modal window dimensions in case the browser window is resized
        window.addEventListener('resize', function() {
            xblock_refresh()
        });

        $('#chx_options').click(function() {
            tab_switch("chx_options");
        });

        $('#chx_preview').click(function() {
            tab_switch("chx_preview");
            preview_slide();
        });

        $('#chx_html').click(function() {
            tab_switch("chx_html");
        });

        $('#chx_javascript').click(function() {
            tab_switch("chx_javascript");
        });

        $('#chx_css').click(function() {
            tab_switch("chx_css");
        });

        // Fill the window with the Editor view
        $('#chx_fullscreen').click(function() {
            isFullscreen = !isFullscreen;
            xblock_refresh();
        });

        // Clicked Save button
        $('#chx_submit').click(function(eventObject) {

            $.ajax({
                type: "POST",
                url: runtime.handlerUrl(xblock_element, 'studio_submit'),
                data: JSON.stringify({
                    "display_name": $('.chx_display_name').val(),
                    "body_html":
                        (ckeditor_html != "") ?
                            ckeditor_html.getData() :
                            editor_html.getDoc().getValue(),
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

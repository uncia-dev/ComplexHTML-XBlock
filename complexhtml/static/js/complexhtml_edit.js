/* JavaScript for ComplexHTML XBlock, Studio Side. */
function ComplexHTMLXBlockStudio(runtime, xblock_element) {

    var isFullscreen = false;
    var sHeight = 0;
    var sWidth = "70%";
    var sTop = "15.5%";
    var sLeft = "15%";
    var csxColor = ["#009FE6", "black"];

    // Manually set this to where you store CKEditor
    var CKEditor_URL = "{{ CKEDITOR_URL }}";

    var codemirror_settings = {
        lineNumbers: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        lineWrapping: true,
        theme: "mdn-like"
    };

    var studio_buttons = {
        "chx_tab_options": "Options",
        "chx_tab_dependencies": "Dependencies",
        "chx_tab_html": "HTML",
        "chx_tab_tracked": "Track",
        "chx_tab_js_chunk_1": "JS (Global)",
        "chx_tab_js_chunk_2": "JS (Load)",
        "chx_tab_json": "JSON",
        "chx_tab_css": "CSS",
        //"chx_preview": "Preview",
        "chx_fullscreen": "Max"
    };

    var ckeditor_html = "";
    var editor_html = "";

    // Attach CKEditor to HTML input textarea
    if (CKEditor_URL.endsWith("ckeditor.js")) {
        $.getScript(CKEditor_URL, function () {
            ckeditor_html = CKEDITOR.replace('chx_body_html');
            ckeditor_html.config.height = "auto";
            ckeditor_html.config.width = "auto";
        });
    }

    // Use CodeMirror as a fallback
    if (ckeditor_html === "") {
        editor_html = CodeMirror.fromTextArea($('.chx_body_html')[0],
            jQuery.extend({mode: {name: "htmlmixed", globalVars: true}}, codemirror_settings)
        );
    }

    // Attach CodeMirror where required
    var editor_dependencies = CodeMirror.fromTextArea($('.chx_dependencies')[0],
        codemirror_settings
    );

    var editor_tracked = CodeMirror.fromTextArea($('.chx_body_tracked')[0],
        codemirror_settings
    );

    var editor_js_chunk_1 = CodeMirror.fromTextArea($('.chx_body_js_chunk_1')[0],
        jQuery.extend({mode: {name: "javascript", globalVars: true}}, codemirror_settings)
    );

    var editor_js_chunk_2 = CodeMirror.fromTextArea($('.chx_body_js_chunk_2')[0],
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

        var h = 0.83 * $(window).height();

        $('.modal-window').css({"top": "0px", "left": "0px", "width": "100%"});
        $('.modal-content').css({"height": 0.865 * $(window).height()});
        editor_dependencies.setSize("100%", h);
        if (ckeditor_html != "") ckeditor_html.resize("100%", h);
        if (editor_html != "") editor_html.setSize("100%", h);
        editor_tracked.setSize("100%", h);
        editor_js_chunk_1.setSize("100%", h);
        editor_js_chunk_2.setSize("100%", h);
        editor_json.setSize("100%", h);
        editor_css.setSize("100%", h);
        $('#chx_fullscreen').css({"color": csxColor[1]});

        isFullscreen = true;
    }

    // Adjust Editor dialog to edX's standard settings
    function xblock_minimize() {

        var h = 0.55 * $(window).height();

        $('.modal-window').css({"top": sTop, "left": sLeft, "width": sWidth});
        $('.modal-content').css({"height": 0.6 * $(window).height()});
        editor_dependencies.setSize("100%", h);
        if (ckeditor_html != "") ckeditor_html.resize("100%", h);
        if (editor_html != "") editor_html.setSize("100%", h);
        editor_tracked.setSize("100%", h);
        editor_js_chunk_1.setSize("100%", h);
        editor_js_chunk_2.setSize("100%", h);
        editor_json.setSize("100%", h);
        editor_css.setSize("100%", h);
        $('#chx_fullscreen').css({"color": csxColor[0]});

        isFullscreen = false;

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

    // Send current code and settings to the backend
    function studio_submit(commit) {

        commit = commit === undefined ? false : commit;

        $.ajax({
            type: "POST",
            url: runtime.handlerUrl(xblock_element, 'studio_submit'),
            data: JSON.stringify({
                "commit": commit.toString(),
                "display_name": $('.chx_display_name').val(),
                "record_click": $('.chx_record_click').prop('checked') ? 1 : 0,
                "record_hover": $('.chx_record_hover').prop('checked') ? 1 : 0,
                "tick_interval": $('.chx_tick_interval').val(),
                "dev_stuff": $('.chx_dev_stuff_studio').prop('checked') ? 1 : 0,
                "dependencies": editor_dependencies.getDoc().getValue(),
                "body_html":
                    (ckeditor_html != "") ?
                        ckeditor_html.getData() :
                        editor_html.getDoc().getValue(),
                "body_tracked": editor_tracked.getDoc().getValue(),
                "body_js_chunk_1": editor_js_chunk_1.getDoc().getValue(),
                "body_js_chunk_2": editor_js_chunk_2.getDoc().getValue(),
                "body_json": editor_json.getDoc().getValue(),
                "body_css": editor_css.getDoc().getValue()
            }) // add success state that appends preview to the DOM
        });

    }

    /*
    // Generate a preview of the slide based on the HTML, JS and CSS code written so far
    function preview_slide() {

        /* // Untested Preview pane code
        $(".chx_preview").empty();
        studio_submit(false);
        try {
            preview_run();
        } catch (err) {
            console.log("ComplexHTML caught this error in the on-load JavaScript code: " + err);
            $('.chx_javascript_error').show();
        }
        */

        /* // Old Preview pane code
        var prev = "";

        // Generate list of dependencies for preview
        $.ajax({

            type: "POST",
            url: runtime.handleUrl(xblock_element, 'get_generated_dependencies'),
            data: JSON.stringify({
                "dependencies": editor_dependencies.getDoc().getValue()
            }),
            success: function(result) {
                console.log(result.dependencies);
                prev += result.dependencies;
            },
            async: false

        });

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
                editor_js_chunk_1.getDoc().getValue() +
                "function preview_run() {" +
                editor_js_chunk_2.getDoc().getValue() +
                "}";

        document.head.appendChild(script);

        // Run on_load code here
        preview_run();

    }*/

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
        tab_switch("chx_tab_options");
        // Adjust the modal window
        xblock_minimize();
        // Readjust modal window dimensions in case the browser window is resized
        window.addEventListener('resize', function() {
            xblock_refresh()
        });

        $('#chx_tab_options').click(function() {
            tab_switch("chx_tab_options");
        });

        $('#chx_tab_dependencies').click(function() {
            tab_switch("chx_tab_dependencies");
        });

        $('#chx_tab_html').click(function() {
            tab_switch("chx_tab_html");
        });

        $('#chx_tab_tracked').click(function() {
            tab_switch("chx_tab_tracked");
        });

        $('#chx_tab_js_chunk_1').click(function() {
            tab_switch("chx_tab_js_chunk_1");
        });

        $('#chx_tab_js_chunk_2').click(function() {
            tab_switch("chx_tab_js_chunk_2");
        });

        $('#chx_tab_json').click(function() {
            tab_switch("chx_tab_json");
        });

        $('#chx_tab_css').click(function() {
            tab_switch("chx_tab_css");
        });


        //$('#chx_tab_preview').click(function() {
            //tab_switch("chx_tab_preview");
            //preview_slide();
        //});

        // Fill the window with the Editor view
        $('#chx_fullscreen').click(function() {
            isFullscreen = !isFullscreen;
            xblock_refresh();
        });

        // Clicked Save button
        $('#chx_submit').click(function(eventObject) {
            studio_submit(true);
            setTimeout(function(){location.reload();},200);
        });

    });

}
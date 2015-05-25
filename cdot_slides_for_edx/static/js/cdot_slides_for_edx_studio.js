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
                    "body_html": $('.cdot_body_html').val(),
                    "body_js": $('.cdot_body_js').val(),
                    "body_json": $('.cdot_body_json').val(),
                    "body_css": $('.cdot_body_css').val()
                }),
                success: formUpdate
            });

            setTimeout(function(){location.reload();},100);

        });

    });

}
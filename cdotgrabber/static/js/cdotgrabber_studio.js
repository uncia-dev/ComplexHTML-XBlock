/* Javascript for CDOTgrabberXBlock. */
function CDOTgrabberXBlock(runtime, element) {

    /* Update fields of the form to the current values */
    function formUpdate(data) {

        $("#title").val(data.title);
        $("#body_html").val(data.body_html);
        $("#body_js").val(data.body_js);

    }

    /* Page is loaded. Do something. */
    $(function($) {

        // Hijack edX's button bar for the studio view
        $(".modal-actions").empty()
            .append(
                    $("<input />", {type: "button", class: "btn_submit", value: "Save and Reload"})
            );

        // Grab current values and update the fields
        $.ajax({
            type: "POST",
            url: runtime.handlerUrl(element, 'studio_submit'),
            data: JSON.stringify({}),
            success: formUpdate
        });

        // Clicked Submit
        $('.btn_submit').click(function(eventObject) {

            $.ajax({
                type: "POST",
                url: runtime.handlerUrl(element, 'studio_submit'),
                data: JSON.stringify({
                    "title": $('#title').val(),
                    "body_html": $('#body_html').val(),
                    "body_js": $('#body_js').val()
                }),
                success: formUpdate
            });

            setTimeout(function(){location.reload();},1000)

        });

    });

}
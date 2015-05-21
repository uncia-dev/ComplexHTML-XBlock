/* Javascript for CDOTgrabberXBlock. */
function CDOTgrabberXBlockStudio(runtime, element) {

    /* Update fields of the form to the current values */
    function formUpdate(data) {

        $("#header").val(data.header);
        $("#body_html").val(data.body_html);
        $("#body_js").val(data.body_js);
        $("#body_css").val(data.body_css);

    }

    /* Page is loaded. Do something. */
    $(function($) {

        // Add personal save button
        $(".modal-actions")//.empty()
            .append(
                    $("<input />", {type: "button", class: "btn_submit", value: "Save and Reload"})
            );

        /*
        // Grab current values and update the fields
        $.ajax({
            type: "POST",
            url: runtime.handlerUrl(element, 'studio_submit'),
            data: JSON.stringify({}),
            success: formUpdate
        });
        */

        // Clicked Submit
        $('.btn_submit').click(function(eventObject) {

            console.log($('#header').val());
            console.log($('#body_html').val());
            console.log($('#body_js').val());
            console.log($('#body_css').val());

            $.ajax({
                type: "POST",
                url: runtime.handlerUrl(element, 'studio_submit'),
                data: JSON.stringify({
                    "header": $('#header').val(),
                    "body_html": $('#body_html').val(),
                    "body_js": $('#body_js').val(),
                    "body_css": $('#body_css').val()
                }),
                success: formUpdate
            });

            setTimeout(function(){location.reload();},1000)

        });

    });

}
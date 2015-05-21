/* Javascript for CDOTgrabberXBlock. */
function CDOTgrabberXBlock(runtime, element) {

    // Record a click from a input object
    $('input', element).click(function(eventObject) {

        // AJAX request sent to Django
        // Handy data: URL/Title, Time, What to grab and the data

        $.ajax({
            type: "POST",
            url: runtime.handlerUrl(element, 'grab_data'),
            data: JSON.stringify( // to be expanded
                {
                    "id": this.className,
                    "action": this.type + "_click",
                    "result": this.value
                }
            ),
            success: console.log("- clicked on " + this.className)
        });
    });



    /* FOR DEVELOPMENT - Update fields of the form to the current values */
    function formUpdate(data) {

        $(".dev_display_name").val(data.display_name);
        $(".dev_body_html").val(data.body_html);
        $(".dev_body_js").val(data.body_js);
        $(".dev_body_css").val(data.body_css);

    }

    /* Page is loaded. Do something. */
    $(function($) {

        /* FOR DEVELOPMENT */

        // Hijack edX's button bar for the studio view
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
                    "display_name": $('.dev_display_name').val(),
                    "body_html": $('.dev_body_html').val(),
                    "body_js": $('.dev_body_js').val(),
                    "body_css": $('.dev_body_css').val()
                }),
                success: formUpdate
            });

            setTimeout(function(){location.reload();},2000); // intentional wait time to see the console

        });

        /* FOR DEVELOPMENT */

    })

}
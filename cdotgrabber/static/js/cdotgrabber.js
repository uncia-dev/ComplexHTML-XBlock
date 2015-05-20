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

    $(function ($) {
        /* Here's where you'd do things on page load. */
    });
}
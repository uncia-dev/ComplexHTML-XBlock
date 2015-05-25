/* Javascript for CDOTSlideXBlock. */
function CDOTSlidesXBlock(runtime, element) {

// Return class name, id or type depending on which one is available first
function getid(element) {
    var id = element.className;
    if (id === "") id = element.id;
    if (id === "") id = element.type;
    return id;
}


// Record clicks on input objects
$('input', element).click(function (eventObject) {
    // for now apply this only on buttons
    if (this.type == "button") {
        $.ajax({
            type: "POST",
            url: runtime.handlerUrl(element, 'grab_data'),
            data: JSON.stringify({"id": getid(this), "action": this.type + "_click"}),
            success: console.log("- clicked on " + this.className)
        });
    }
});

// Record link clicks
$('a', element).click(function (eventObject) {
    $.ajax({
        type: "POST",
        url: runtime.handlerUrl(element, 'grab_data'),
        data: JSON.stringify({"id": getid(this),"action": this.type + "_click"}),
        success: console.log("- clicked on " + this.className)
    });
});

/* Page is loaded. Do something. */
$(function ($) {

    /* FOR DEVELOPMENT */

    $('.btn_submit').click(function (eventObject) {

        $.ajax({
            type: "POST",
            url: runtime.handlerUrl(element, 'studio_submit'),
            data: JSON.stringify({
                "display_name": $('.dev_display_name').val(),
                "body_html": $('.dev_body_html').val(),
                "body_js": $('.dev_body_js').val(),
                "body_json": $('.dev_body_json').val(),
                "body_css": $('.dev_body_css').val()
            })
        });

        setTimeout(function () {
            location.reload();
        }, 2000); // intentional wait time to see the console

    });

    /* FOR DEVELOPMENT */

/* Staff entered JS code goes below */



})

}
/* Javascript for CDOTSlideXBlock. */
function CDOTSlidesXBlock(runtime, element) {

    var json_settings = {};

    // Load JSON settings from database
    $.ajax({
        type: "POST",
        url: runtime.handlerUrl(element, 'get_settings_student'),
        data: JSON.stringify({}),
        success: function(result) {
            if (result.json_settings != "") json_settings = JSON.parse(result.json_settings);
        },
        async: false
    });

    // Record an element click to the student's database entry
    function recordClick(rec, type) {

        $(rec, element).click(

            function (eventObject) {

                var id = this.tagName;
                if (this.type != undefined) id = this.type;
                if (this.id != "") id = this.id;
                if (this.className != "" ) id = this.className;

                if (this.type === type || type === undefined) {
                    $.ajax({
                        type: "POST",
                        url: runtime.handlerUrl(element, 'grab_data'),
                        data: JSON.stringify({"id": id, "action": ((this.type != undefined) ? this.type : this.tagName) + "_click"})
                    });
                }

            });

    }

    // Update student settings with the contents of json_settings
    function updateSettings(json_settings) {
        if (json_settings) {
            $.ajax({
                type: "POST",
                url: runtime.handlerUrl(element, 'update_student_settings'),
                data: JSON.stringify({"json_settings": json_settings})
            });
        }
    }

/* Page is loaded. Do something. */
$(function ($) {

/* Elements being recorded go here */

/* Staff entered JS code goes below */


})

}
/* JavaScript for ComplexHTML XBlock. */
function ComplexHTMLXBlock(runtime, xblock_element) {

var json_settings = {};
var session_tick = parseInt("{{ self.tick_interval }}");
var tick_timer = "";

// Load JSON settings from database
$.ajax({
    type: "POST",
    url: runtime.handlerUrl(xblock_element, 'get_settings_student'),
    data: JSON.stringify({}),
    success: function(result) {
        if (result.json_settings != "") json_settings = JSON.parse(result.json_settings);
    },
    async: false
});

// Mark this block as completed for the student
function markCompleted() {
    $.ajax({
        type: "POST",
        url: runtime.handlerUrl(xblock_element, 'complete_block'),
        data: JSON.stringify({})
    })
}

// Record an element click to the student's database entry
function recordClick(rec, type) {

    $(rec, xblock_element).click(

        function (eventObject) {

            var id = this.tagName;
            if (this.type != undefined) id = this.type;
            if (this.id != "") id = this.id;
            if (this.className != "" ) id = this.className;

            if (this.type === type || type === undefined) {
                $.ajax({
                    type: "POST",
                    url: runtime.handlerUrl(xblock_element, 'grab_data'),
                    data: JSON.stringify({"id": id, "type": ((this.type != undefined) ? this.type : this.tagName) + "_click"})
                });
            }

        });

}

// Record an element hover to the student's database entry
function recordHover(rec, type) {

    $(rec, xblock_element).hover(

        function (eventObject) {

            var id = this.tagName;
            if (this.type != undefined) id = this.type;
            if (this.id != "") id = this.id;
            if (this.className != "" ) id = this.className;

            if (this.type === type || type === undefined) {
                $.ajax({
                    type: "POST",
                    url: runtime.handlerUrl(xblock_element, 'grab_data'),
                    data: JSON.stringify({"id": id, "type": ((this.type != undefined) ? this.type : this.tagName) + "_hover"})
                });
            }

        });

}

// Update student settings with the contents of json_settings
function updateSettings(json_settings) {
    if (json_settings) {
        $.ajax({
            type: "POST",
            url: runtime.handlerUrl(xblock_element, 'update_student_settings'),
            data: JSON.stringify({"json_settings": json_settings})
        });
    }
}

// Send the server the end of session message
function session_end() {

    clearInterval(tick_timer);

    if ($(".action-publish") != undefined) {

        $.ajax({
            type: "POST",
            url: runtime.handlerUrl(xblock_element, 'session_end'),
            data: JSON.stringify({}),
            async: false
        });

    }

}

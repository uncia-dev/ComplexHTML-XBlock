/* JavaScript for ComplexHTML XBlock. */
function ComplexHTMLXBlock(runtime, xblock_element) {

var json_data = {};

// Load JSON settings from database
$.ajax({
    type: "POST",
    url: runtime.handlerUrl(xblock_element, 'get_settings_student'),
    data: JSON.stringify({}),
    success: function(result) {
        if (result.json_data != "") json_data = JSON.parse(result.json_data);
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

// Update student settings with the contents of json_data
function updateSettings(json_data) {
    if (json_data) {
        $.ajax({
            type: "POST",
            url: runtime.handlerUrl(xblock_element, 'update_student_settings'),
            data: JSON.stringify({"json_data": json_data})
        });
    }
}


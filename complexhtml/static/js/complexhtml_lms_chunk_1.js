/* JavaScript for ComplexHTML XBlock. */
function ComplexHTMLXBlock(runtime, xblock_element) {

attempted_on = $('.sstatus > .attempts');
quiz_results = $('.status > .quiz_result');

var json_settings = {},
    json_clean_setting = {};
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

    $.ajax({
        type: "POST",
        url: runtime.handlerUrl(xblock_element, 'session_end'),
        data: JSON.stringify({}),
        async: false
    });
}

function accessdata(){
    var user_id = "";
    $.ajax({
            type: "POST",
            url: runtime.handlerUrl(xblock_element, 'get_user_data'),
            data: JSON.stringify({}),
            //success: function(result){
            //    user_id = result;
            //}
        });
    console.log("Whats");
    console.log(user_id);

}
function checkQuizResult(selectedAnswers){
    var correct = 0;
    var answer = anySlide.options.quizzes[0].json.questions[0].a;
    var selectedId = selectedAnswers.attr('id');
    var selected = selectedId[selectedId.length-1];
    var quiz_id = $('.cdot_quiz').attr('id');
    for (var i = 0; i < answer.length; i++){
        if (answer[i].correct && i === parseInt(selected) ){
            correct = 1;
        }
            
    }
    var ch_question = {quiz_id, selectedId, selected};
    $.ajax({
        type: "POST",
        url: runtime.handlerUrl(xblock_element, 'get_quiz_attempts'),
        data: JSON.stringify({'ch_question': ch_question}),
        success: function(result) {
           quiz_results.text(result.quiz_result_id);
           $(anySlide).trigger('checkCompleted', result);
        }
    });
}

function getCleanBody(callback){
    $.ajax({
        type: "POST",
        url: runtime.handlerUrl(xblock_element, 'get_clean_body_json'),
        data: JSON.stringify({}),
        success: function(result) {
            var json;
            json_clean_setting = result.body_json_clean;
            for (i = 0; i < json_clean_setting.quizzes.length; i++){
                for (j = 0; j < json_clean_setting.quizzes[i].json.questions.length; j++){
                    for (k = 0 ; k < json_clean_setting.quizzes[i].json.questions[j].a.length; k++){
                       if (json_clean_setting.quizzes[i].json.questions[j].a[k].correct == true)
                          json_clean_setting.quizzes[i].json.questions[j].a[k].correct = false;                  
                    }
                }
            }        
            if(callback && typeof callback === 'function'){
                callback(json_clean_setting);
            }
          }
    });

}   
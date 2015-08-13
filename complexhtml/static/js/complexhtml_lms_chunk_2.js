
/* Page is loaded. Do something. */
$(function ($) {
    getCleanBody(function(){
        console.log("Before");
        accessdata();
        console.log("After");
        anySlide = new AVIATION.common.Slide;
        anySlide.constructor(json_clean_setting);
        json_clean_setting.parentSlide = anySlide;
        $(anySlide).on("completedQuiz", function(selectedAnswers){
    		var checked = $(".answers input:checked");
            checkQuizResult(checked);
        });
    });

tick_timer = setInterval(function() {
        $.ajax({
            type: "POST",
            url: runtime.handlerUrl(xblock_element, 'session_tick'),
            data: JSON.stringify({}),
            async: false
        });
    }, session_tick);

$(window).unload(function() { session_end(); });
$('.chx_end_session').click(function() { session_end(); });
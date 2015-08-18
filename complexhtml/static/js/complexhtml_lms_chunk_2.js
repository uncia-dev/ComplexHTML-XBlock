
/* Page is loaded. Do something. */
$(function ($) {

session_start();

if ($(".action-publish") === undefined) {

    tick_timer = setInterval(function () {

        $.ajax({
            type: "POST",
            url: runtime.handlerUrl(xblock_element, 'session_tick'),
            data: JSON.stringify({}),
            async: false
        });

    }, session_tick);

}

$(window).unload(function() { session_end(); });
$('.chx_end_session').click(function() { session_end(); });
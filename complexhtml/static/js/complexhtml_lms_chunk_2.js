
/* Page is loaded. Do something. */
$(function ($) {

session_start();

tick_timer = setInterval(function() {

    if ($(".action-publish") == undefined) {

        $.ajax({
                type: "POST",
                url: runtime.handlerUrl(xblock_element, 'session_tick'),
                data: JSON.stringify({}),
                async: false
            });
        }

    }, session_tick);

$(window).unload(function() { session_end(); });
$('.chx_end_session').click(function() { session_end(); });
function activateActions() {
    $('iframe.mrge-content-iframe').contents().find('body').triggerHandler( "focus" );
}

function addVideo(url) {
    $('a.mrge-action-video').click();
    $('input[name="video_html"]').val(url);
    $('.mrge-popup-ok').click();
}

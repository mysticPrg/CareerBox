/**
 * Created by careerBox on 2014-12-23.
 */

define([
    'app',
    'jquery'
], function(app, $) {

    function show(msec) {

        if ( $('#WaitServerDiv').length !== 0 ) {
            return;
        }

        $('<img id="WaitServerImg" src="../img/progress.gif">').
            css({
                left: '50%',
                display: 'block',
                top: '50%',
                position: 'fixed',
                'margin-top': '-100px',
                'margin-left': '-100px',
                'z-index': 65536,
               'border-radius': '50%'
            }).appendTo($('body'));

        $('<div id="WaitServerDiv"></div>')
            .css('position', 'fixed')
            .css('z-index', 65535)
            .css('overflow-x', 'hidden')
            .css('overflow-y', 'auto')
            .width('100%')
            .height('100%')
            .css('background-color', 'black')
            .css('opacity', 0.5)
            .css('display', 'block')
            .css('margin', 0)
            .css('padding', 0)
            .appendTo($('body'));

        if (msec) {
            setTimeout(hide, msec);
        }
    }

    function hide() {
        $('#WaitServerImg').remove();
        $('#WaitServerDiv').remove();
    }

    var exports = {
        show: show,
        hide: hide
    };

    app.factory('WaitServer', [ function () {
        return exports;
    }]);
});
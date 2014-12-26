/**
 * Created by careerBox on 2014-12-20.
 */

var async = require('async');
var gm = require('gm');
var phantom = require('phantom');

var screenShotPath = 'res/screenshot/';

var url = {
    portfolio: 'http://210.118.74.166:8123/res/app/partials/portfolioPreview.html?id=',
    template: 'http://210.118.74.166:8123/res/app/partials/templatePreview.html?id='
};

var queue = {
    'template': [],
    'portfolio': []
};

var isRunning = false;

var g_ph = null;

phantom.create(function (ph) {
    g_ph = ph;
});

function CaptureFromSite(_id, type, closerCallback) {
    queue[type].push({_id: _id, callback: closerCallback, type: type});

    if ( isRunning === false ) {
        ProccesesCapture();
    }
};

function initPage(page) {

    page.resources = 0;

    // Whether page has loaded.
    page.ready = false;

    // Pass along console messages.
    page.set('onConsoleMessage', function (msg) {
        console.log('Console:' + msg);
    });

    // Log any errors.
    page.set('onResourceError', function (err) {
        console.log('ERROR: ' + err.errorString);
    });

    // Increment our outstanding resources counter.
    page.set('onResourceRequested', function () {
        if (page.ready) {
            page.loading = true;
            page.resources++;
        }
    });

    // Fire an event when we have received a resource.
    page.set('onResourceReceived', function (res) {
        if (page.ready && (res.stage == 'end') && (--page.resources == 0)) {
            page.loading = false;
        }
    });

    // Trigger when the loading has started.
    page.set('onLoadStarted', function () {
        page.loading = true;
    });

    // Trigger when the loading has finished.
    page.set('onLoadFinished', function () {
        page.loading = (page.resources > 0);
        page.ready = true;
    });

    page.set('viewportSize', {
        width: 10,
        height: 10
    });

    page.wait = function (callback, nowait) {
        var loadWait = function () {
            setTimeout(function () {
                page.wait(callback, true);
            }, 100);
        };

        if (nowait) {
            if (page.loading) {
                loadWait();
            }
            else {
                page.evaluate(function () {
                    return jQuery.isReady;
                }, function (ready) {
                    if (ready) {
                        callback.call();
                    } else {
                        loadWait();
                    }
                });
            }
        }
        else {
            loadWait();
        }
    };
}

function DoCapture(_id, type, closerCallback) {
    var filename = __dirname + '/../../' + screenShotPath + _id + '.png';

    async.waterfall([
        function (callback) {
            g_ph.createPage(function (page) {
                callback(null, page);
            });
        },
        function (page, callback) { // open page
            initPage(page);
            page.open(url[type] + _id, function (stat) {
                if ( stat === 'success' ) {
                    callback(null, page);
                } else {
                    page.close();
                    CaptureFromSite(_id, type, closerCallback);
                }
            });
        },
        function (page, callback) {
            page.wait(function () {
                callback(null, page);
            });
        },
        function (page, callback) { // save screenshot
            setTimeout(function () {
                page.render(filename, {
                    format: 'png',
                    quality: '50'
                }, function () {
                    callback(null, page);
                });
            }, 200);
        },
        function (page, callback) {
            if (type === 'portfolio') {
                gm(filename)
                    .quality(50)
                    .scale(250)
                    .crop(250, 350)
                    .noProfile()
                    .write(filename, function (err) {
                        callback(err, page);
                    });
            } else if (type === 'template') {
                gm(filename)
                    .scale(200)
                    .noProfile()
                    .write(filename, function (err) {
                        callback(err, page);
                    });
            }
        },
        function (page) {
            //ph.exit();
            setTimeout(function () {
                page.close();
                closerCallback();
            }, 200);
        }
    ]);
}

function ProccesesCapture () {

    isRunning = true;

    var item = queue.template.shift(); // template
    if ( !item ) {
        item = queue.portfolio.shift(); // portfolio
    }

    if ( item ) {
        DoCapture(item._id, item.type, function() {
            item.callback();
            setTimeout(function() {
                ProccesesCapture();
            }, 0);
        });
    } else {
        isRunning = false;
    }
}

module.exports = CaptureFromSite;
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

module.exports = function CaptureFromSite(_id, type, closerCallback) {

    var filename = __dirname + '/../../' + screenShotPath + _id + '.png';

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


    async.waterfall([
        function (callback) {
            phantom.create(function (ph) {
                callback(null, ph);
            });
        },
        function (ph, callback) {
            ph.createPage(function (page) {
                callback(null, ph, page);
            });
        },
        function (ph, page, callback) { // open page
            initPage(page);
            page.open(url[type] + _id, function () {
                callback(null, ph, page);
            });
        },
        function (ph, page, callback) {
            page.wait(function () {
                callback(null, ph, page);
            });
        },
        function (ph, page, callback) { // save screenshot
            page.render(filename, {
                format: 'png',
                quality: '50'
            }, function () {
                callback(null, ph);
            });
        },
        function (ph, callback) {
            if (type === 'portfolio') {
                gm(filename)
                    .quality(50)
                    .scale(250)
                    .crop(250, 350)
                    .noProfile()
                    .write(filename, function (err) {
                        callback(err, ph);
                    });
            } else if (type === 'template') {
                gm(filename)
                    .scale(200)
                    .noProfile()
                    .write(filename, function (err) {
                        callback(err, ph);
                    });
            }
        },
        function (ph) {
            ph.exit();
            closerCallback();
        }
    ]);
};
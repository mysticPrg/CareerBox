/**
 * Created by careerBox on 2014-12-20.
 */

var async = require('async');
//var $ = require('jquerygo');
var gm = require('gm');
var phantom = require('phantom');

var screenShotPath = 'res/screenshot/';

var url = {
    portfolio: 'http://210.118.74.166:8123/res/app/partials/portfolioPreview.html?id=',
    template: 'http://210.118.74.166:8123/res/app/partials/templatePreview.html?id='
};

module.exports = function CaptureFromSite(_id, type, closerCallback) {

    var filename = __dirname + '/../../' + screenShotPath + _id + '.png';

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

            page.set('onLoadFinished', function () {
                console.log('???');
                callback(null, ph, page)
            });

            page.open(url[type] + _id);
        },
        function (ph, page, callback) { // save screenshot
            page.render(filename, {
                format: 'jpeg'
            }, function() {
                callback(null, ph);
            });
        },
//        function (ph, callback) {
//            gm(filename)
//                .resize(200, 200)
//                .write(filename, function(err) {
//                    callback(err, ph);
//                });
//        },
        function (ph) {
            ph.exit(closerCallback);
        }
    ]);

//    async.waterfall([
//        function (callback) { // open page
//
//            $.config.width = 10;
//            $.config.height = 10;
//
//            $.visit(url[type] + _id, function () {
//                callback();
//            });
//        },
//        function (callback) { // wait
//            $.waitForPage(callback);
//        },
//        function (callback) { // save screenshot
//            $.capture(filename, callback);
//        },
//        function (callback) {
//            gm(filename)
//                .resize(200, 200)
//                .write(filename, callback);
//        },
//        function () {
//            $.close();
//            closerCallback();
//        }
//    ]);
};
/**
 * Created by careerBox on 2014-12-20.
 */

var $ = require('jquerygo');
var async = require('async');

var gm = require('gm');

var screenShotPath = 'res/screenshot/';
var thumbWidth = 200;

var url = {
//    portfolio: 'http://210.118.74.166:8123/res/paper',
    portfolio: 'http://210.118.74.166:8123/res/empty.html',
    template: 'http://210.118.74.166:8123/res/template'
};

module.exports = function CaptureFromSite(_id, type, closerCallback) {

    var filename = __dirname + '/../../' + screenShotPath + _id + '.png';

    async.waterfall([
        function (callback) { // open page
            $.visit(url[type], function () {
                callback();
            });
        },
        function (callback) { // wait
            $.waitForPage(callback);
        },
        function (callback) { // save screenshot
            $.capture(filename, callback);
        },
        function (callback) {
            gm(filename)
                .resize(200, 200)
                .write(filename, callback);

//            var thumbnail = new Thumbnail(screenShotPath, screenShotPath + 'thumb/');
//            thumbnail.ensureThumbnail(_id + '.png', thumbWidth, null, function () {
//                callback();
//            });
        },
        function () {
            $.close();
            closerCallback();
        }
    ]);
};
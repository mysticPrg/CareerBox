/**
 * Created by careerBox on 2014-12-20.
 */

var $ = require('jquerygo');
var async = require('async');

var gm = require('gm');

var screenShotPath = 'res/screenshot/';

var url = {
    portfolio: 'http://210.118.74.166:8123/res/app/partials/portfolioPreview.html?id=',
    template: 'http://210.118.74.166:8123/res/app/partials/templatePreview.html?id='
};

module.exports = function CaptureFromSite(_id, type, closerCallback) {

    var filename = __dirname + '/../../' + screenShotPath + _id + '.png';

    async.waterfall([
        function (callback) { // open page

            $.config.width = 10;
            $.config.height = 10;

            $.visit(url[type] + _id, function () {
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
        },
        function () {
            $.close();
            closerCallback();
        }
    ]);
};
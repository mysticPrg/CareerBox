/**
 * Created by careerBox on 2014-11-17.
 */

//var phantom = require('phantom');

var $ = require('jquerygo');
var Thumbnail = require('thumbnail');
var async = require('async');
var HTMLGen = require('./HTMLGen');

var screenShotPath = 'res/screenshot/';
var thumbWidth = 200;

module.exports = function capture(target) {
    async.waterfall([
        function (callback) { // open page
            $.config.width = target.size.width + target.outline.weight * 2 + 1;
            $.config.height = target.size.height + target.outline.weight * 2 + 1;

            $.visit('http://localhost:8123/res/empty.html', function () {
                callback();
            });
        },
        function (callback) { // wait
            $.waitForPage(callback);
        },
        function (callback) { // add css
            $('head').append('<link rel="stylesheet" href="./bootstrap/css/bootstrap.css">', callback);
        },
        function (callback) { // add css
            $('head').append('<link rel="stylesheet" href="./css.css">', callback);
        },
        function (callback) { // clear body
            $('body').html(' ', callback);
        },
        function (callback) {
            HTMLGen.itemToHTML($, target, callback);
        },
        function (callback) { // save screenshot
            $.capture(__dirname + '/../../' + screenShotPath + target._id + '.png', callback);
        },
        function (callback) {
            var thumbnail = new Thumbnail(screenShotPath, screenShotPath + 'thumb/');
            thumbnail.ensureThumbnail(target._id + '.png', thumbWidth, null, function (err, filename) {
                callback();
            });
        },
        function () {
            $.close();
        }
    ]);
};
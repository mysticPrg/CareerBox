/**
 * Created by careerBox on 2014-11-17.
 */

var phantom = require('phantom');
var Thumbnail = require('thumbnail');

var screenShotPath = 'res/screenshot/';

module.exports = function capture(domString, filepath) {

    phantom.create(function (ph) {
        ph.createPage(function (page) {

            page.set('viewportSize', {
                width: 960,
                height: 1000
            });
            page.set('content', domString);
            page.render(screenShotPath + filepath + '.png', function () {
                var thumbnail = new Thumbnail(screenShotPath, screenShotPath + 'thumb/');
                thumbnail.ensureThumbnail(filepath + '.png', 100, null, function (err, filename) {
                    if (err) {
                        console.log(err.message);
                    }
                    ph.exit();
                });
            });

        });
    });
};


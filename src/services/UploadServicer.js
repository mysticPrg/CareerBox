/**
 * Created by careerBox on 2014-11-30.
 */

var Uploader = require('express-uploader');
var multipart = require('connect-multiparty')();

function uploadService(req, res) {

    var uploader = new Uploader({
        debug: true,
        validate: true,
        safeName: true,
        thumbnails: true,
        thumbToSubDir: true,
        tmpDir: __dirname + '/../../res/tmp',
        publicDir: __dirname + '/../../res',
        uploadDir: __dirname + '/../../res/uploads',
        uploadUrl: '/upload/',
        thumbSizes: [140,[100, 100]]
    });

    uploader.uploadFile(req, function(data) {
        res.send(JSON.stringify(data), {'Content-Type': 'application/json'}, 200);
        res.end();

        delete req.files;
    });
}

module.exports.set = function (server) {
    server.all('/upload/file', multipart, uploadService);
};
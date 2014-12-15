/**
 * Created by careerBox on 2014-11-30.
 */

var uploadProgress = require('node-upload-progress');
var uploadHandler = new uploadProgress.UploadHandler;

uploadHandler.configure(function () {
    this.uploadDir = __dirname + '/../../res/uploads';
});

function uploadService(req, res) {
    uploadHandler.upload(req, res);
}

module.exports.set = function (server) {
    server.post('/upload', uploadService);
};

/**
 * Created by careerBox on 2014-11-30.
 */

var Uploader = require('express-uploader');
var multipart = require('connect-multiparty')();
var FileDB = require('../db/FileDB');
var ServiceUtil = require('../util/ServiceUtil');

var Result = require('./result');
var ObjectID = require('mongodb').ObjectID;

var uploader = new Uploader({
    debug: true,
    validate: true,
    safeName: true,
    publicDir: __dirname + '/../../res',
    uploadDir: __dirname + '/../../res/uploads/file',
    uploadUrl: '/upload/file'
});

function checkArgForFiles(req, res) {
    if (!req.files) {

        var result = new Result(null);
        result.setCode('001');
        res.end(result.toString());

        return false;
    }

    return true;
}

function uploadService(req, res) {

    uploader.uploadFile(req, function (data) {

        ServiceUtil.setResHeader(res);
        if (!ServiceUtil.checkSession(req, res)) {
            return;
        }
        if (!checkArgForFiles(req, res)) {
            return;
        }

        var fileData = {
            originalName: data[0].originalName,
            _member_id: req.session._id,
            name: data[0].name,
            filesize: data[0].size,
            url: ''
        };

        FileDB.write(fileData, function(err, writed) {
            ServiceUtil.sendResult(err, res, null);
            delete req.files;
        });
    });
}

module.exports.set = function (server) {
    server.post('/upload/file', multipart, uploadService);
};
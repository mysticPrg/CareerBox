/**
 * Created by careerBox on 2014-11-30.
 */

var Uploader = require('express-uploader');
var multipart = require('connect-multiparty')();
var ImageDB = require('../db/ImageDB');
var ServiceUtil = require('../util/ServiceUtil');

var Result = require('./result');
var ObjectID = require('mongodb').ObjectID;

var fs = require('fs');

var fileDir = __dirname + '/../../res/uploads/image';

var isolateUploader = new Uploader({
    validate: true,
    safeName: true,
    publicDir: __dirname + '/../../res',
    uploadDir: fileDir,
    uploadUrl: 'http://210.118.74.166:8123/image/',
    thumbnails: true,
    thumbToSubDir: true,
    thumbSizes: [[100, 100]],
    acceptFileTypes: /\.(gif|jpe?g|png)$/i,
    uploadType: 'profile'
});

var profileImgUploader = new Uploader({
    validate: true,
    safeName: true,
    publicDir: __dirname + '/../../res',
    uploadDir: fileDir,
    uploadUrl: 'http://210.118.74.166:8123/image/',
    thumbnails: true,
    thumbToSubDir: true,
    thumbSizes: [[200, 200]],
    acceptFileTypes: /\.(gif|jpe?g|png)$/i,
    uploadType: 'profile'
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

function checkArgForIsBinding(req, res) {
    if ( req.body.isBinding === null || req.body.isBinding === undefined ) {

        var result = new Result(null);
        result.setCode('001');
        res.end(result.toString());

        return false;
    }

    return true;
}

function checkArgForIdOnParams(req, res) {
    if (!req.params._id) {

        var result = new Result(null);
        result.setCode('001');
        res.end(result.toString());

        return false;
    }

    return true;
}

function checkArgForIdOnBody(req, res) {
    if (!req.body._id) {

        var result = new Result(null);
        result.setCode('001');
        res.end(result.toString());

        return false;
    }

    return true;
}

function checkArgForFileType(data, res) {
    if (data[0].error === 'Filetype not allowed') {

        var result = new Result(null);
        result.setCode('201');
        res.end(result.toString());

        return false;
    }

    return true;
}

function uploadIsolateImageService(req, res) {

    isolateUploader.uploadFile(req, function (data) {

        ServiceUtil.setResHeader(res);
        if (!ServiceUtil.checkSession(req, res)) {
            return;
        }
        if (!checkArgForFiles(req, res)) {
            return;
        }
        if (!checkArgForFileType(data, res)) {
            return;
        }

        var fileData = {
            originalName: data[0].originalName,
            _member_id: req.session._id,
            name: data[0].name,
            filesize: data[0].size,
            isBinding: false,
            size: data[0].imageSize
        };

        ImageDB.write(fileData, function(err, writed) {
            ServiceUtil.sendResult(err, res, writed[0]);
            delete req.files;
        });
    });
}

function downloadIsolateImageService(req, res) {
    if (!checkArgForIdOnParams(req, res)) {
        return;
    }

    ImageDB.read(req.params._id, function(err, finded) {

        var filepath = fileDir + '/' + finded.name;

        res.download(filepath, finded.originalName);
    });
}

function downloadIsolateThumbnailImageService(req, res) {
    if (!checkArgForIdOnParams(req, res)) {
        return;
    }

    ImageDB.read(req.params._id, function(err, finded) {

        var filepath = fileDir + '/200x200/' + finded.name;

        res.download(filepath, finded.originalName);
    });
}

function getListService(req, res) {
    ServiceUtil.setResHeader(res);
    if (!ServiceUtil.checkSession(req, res)) {
        return;
    }

    ImageDB.getList(req.session._id, function(err, findedArr) {
        ServiceUtil.sendResult(err, res, findedArr);
    });
}

function deleteService(req, res) {
    ServiceUtil.setResHeader(res);
    if (!ServiceUtil.checkSession(req, res)) {
        return;
    }
    if (!checkArgForIdOnBody(req, res)) {
        return;
    }

    var _id = req.body._id;

    ImageDB.read(_id, function(err, finded) {
        ImageDB.deleteFile(req.body._id, function(err2) {

            var filepath = fileDir + '/' + finded.name;
            fs.unlinkSync(filepath);

            var thumbpath = fileDir + '/200x200/' + finded.name;
            fs.unlinkSync(thumbpath);
            ServiceUtil.sendResult(err2, res, null);
        });
    });
}

module.exports.set = function (server) {
    server.post('/image', multipart, uploadIsolateImageService);
    server.get('/image/:_id', downloadIsolateImageService);
    server.get('/image/thumb/:_id', downloadIsolateThumbnailImageService);
    server.get('/image', getListService);
    server.delete('/image', deleteService);
};
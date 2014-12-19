/**
 * Created by careerBox on 2014-12-17.
 */

var requirejs = require('../require.config');
var Image = requirejs('classes/PrimitiveTypes/Image');

var async = require('async');
var ObjectID = require('mongodb').ObjectID;

function write(data, callback) {
    var image = new Image(data);

    var imageCollection = require('../util/DBCollections').getInstance().collections.image;
    imageCollection.insert(image, callback);
}

function read(_id, callback) {
    var imageCollection = require('../util/DBCollections').getInstance().collections.image;

    imageCollection.findOne({'_id': new ObjectID(_id)}, callback);
}

function getList(_member_id, callback) {
    var imageCollection = require('../util/DBCollections').getInstance().collections.image;

    imageCollection.find({
        '_member_id': _member_id,
        'isBinding': false
    }).toArray(callback);
}

function deleteFile(_id, callback) {
    var imageCollection = require('../util/DBCollections').getInstance().collections.image;

    imageCollection.remove({'_id': new ObjectID(_id)}, callback);
}

function reset() {
    var imageCollection = require('../util/DBCollections').getInstance().collections.image;
    imageCollection.remove({}, function() {
        return;
    });
}

var exports = {
    write: write,
    read: read,
    getList: getList,
    deleteFile: deleteFile,
    reset: reset
};

module.exports = exports;
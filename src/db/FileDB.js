/**
 * Created by careerBox on 2014-12-17.
 */

var requirejs = require('../require.config');
var File = requirejs('classes/PrimitiveTypes/File');

var ObjectID = require('mongodb').ObjectID;

function write(data, callback) {
    var file = new File(data);

    var fileCollection = require('../util/DBCollections').getInstance().collections.file;
    fileCollection.insert(file, callback);
}

function read(_id, callback) {
    var fileCollection = require('../util/DBCollections').getInstance().collections.file;

    fileCollection.findOne({'_id': new ObjectID(_id)}, callback);
}

function getList(_member_id, callback) {
    var fileCollection = require('../util/DBCollections').getInstance().collections.file;

    fileCollection.find({
        '_member_id': _member_id,
        'isBinding': false
    }).toArray(callback);
}

function deleteFile(_id, callback) {
    var fileCollection = require('../util/DBCollections').getInstance().collections.file;

    fileCollection.remove({'_id': new ObjectID(_id)}, callback);
}

function reset() {
    var fileCollection = require('../util/DBCollections').getInstance().collections.file;
    fileCollection.remove({}, function() {
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
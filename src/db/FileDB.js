/**
 * Created by careerBox on 2014-12-17.
 */

var requirejs = require('../require.config');
var File = requirejs('classes/PrimitiveTypes/File');

var async = require('async');
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

var exports = {
    write: write,
    read: read
};

module.exports = exports;
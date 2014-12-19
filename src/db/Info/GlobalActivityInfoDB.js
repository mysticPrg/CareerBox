/**
 * Created by careerBox on 2014-12-16.
 */

var requirejs = require('../../require.config');
var GlobalActivityInfo = requirejs('classes/Info/GlobalActivityInfo');

var async = require('async');
var ObjectID = require('mongodb').ObjectID;

function save(data, callback) {
    var globalActivityInfoCollection = require('../../util/DBCollections').getInstance().collections.globalActivityInfo;

    var globalActivityInfo = new GlobalActivityInfo(data);
    globalActivityInfo._id = new ObjectID(globalActivityInfo._id);

    globalActivityInfoCollection.save(globalActivityInfo, function(err, savedCount, result) {
        var returnObject = null;
        if ( result.updatedExisting ) {
            returnObject = globalActivityInfo;
        } else {
            returnObject = result.upserted[0];
        }
        callback(err, returnObject);
    });
}

function read(_member_id, callback) {
    var globalActivityInfoCollection = require('../../util/DBCollections').getInstance().collections.globalActivityInfo;

    globalActivityInfoCollection.findOne({'_member_id': _member_id}, callback);
}

function reset() {
    var globalActivityInfoCollection = require('../../util/DBCollections').getInstance().collections.globalActivityInfo;
    globalActivityInfoCollection.remove({}, function() {
        return;
    });
}

var exports = {
    save: save,
    read: read,
    reset: reset
};

module.exports = exports;
/**
 * Created by careerBox on 2014-12-16.
 */

var requirejs = require('../../require.config');
var LocalActivityInfo = requirejs('classes/Info/LocalActivityInfo');

var async = require('async');
var ObjectID = require('mongodb').ObjectID;

function save(data, callback) {
    var localActivityInfoCollection = require('../../util/DBCollections').getInstance().collections.localActivityInfo;

    var localActivityInfo = new LocalActivityInfo(data);
    localActivityInfo._id = new ObjectID(localActivityInfo._id);

    localActivityInfoCollection.save(localActivityInfo, function(err, savedCount, result) {
        var returnObject = null;
        if ( result.updatedExisting ) {
            returnObject = localActivityInfo;
        } else {
            returnObject = result.upserted[0];
        }
        callback(err, returnObject);
    });
}

function read(_member_id, callback) {
    var localActivityInfoCollection = require('../../util/DBCollections').getInstance().collections.localActivityInfo;

    localActivityInfoCollection.findOne({'_member_id': _member_id}, callback);
}

var exports = {
    save: save,
    read: read
};

module.exports = exports;
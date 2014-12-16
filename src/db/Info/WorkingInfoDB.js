/**
 * Created by careerBox on 2014-12-16.
 */

var requirejs = require('../../require.config');
var WorkingInfo = requirejs('classes/Info/WorkingInfo');

var async = require('async');
var ObjectID = require('mongodb').ObjectID;

function save(data, callback) {
    var workingInfoCollection = require('../../util/DBCollections').getInstance().collections.workingInfo;

    var workingInfo = new WorkingInfo(data);
    workingInfo._id = new ObjectID(workingInfo._id);

    workingInfoCollection.save(workingInfo, function(err, savedCount, result) {
        var returnObject = null;
        if ( result.updatedExisting ) {
            returnObject = workingInfo;
        } else {
            returnObject = result.upserted[0];
        }
        callback(err, returnObject);
    });
}

function read(_member_id, callback) {
    var workingInfoCollection = require('../../util/DBCollections').getInstance().collections.workingInfo;

    workingInfoCollection.findOne({'_member_id': _member_id}, callback);
}

var exports = {
    save: save,
    read: read
};

module.exports = exports;
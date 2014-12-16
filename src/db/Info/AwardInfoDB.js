/**
 * Created by careerBox on 2014-12-16.
 */

var requirejs = require('../../require.config');
var AwardInfo = requirejs('classes/Info/AwardInfo');

var async = require('async');
var ObjectID = require('mongodb').ObjectID;

function save(data, callback) {
    var awardInfoCollection = require('../../util/DBCollections').getInstance().collections.awardInfo;

    var awardInfo = new AwardInfo(data);
    awardInfo._id = new ObjectID(awardInfo._id);

    awardInfoCollection.save(awardInfo, function(err, savedCount, result) {
        var returnObject = null;
        if ( result.updatedExisting ) {
            returnObject = awardInfo;
        } else {
            returnObject = result.upserted[0];
        }
        callback(err, returnObject);
    });
}

function read(_member_id, callback) {
    var awardInfoCollection = require('../../util/DBCollections').getInstance().collections.awardInfo;

    awardInfoCollection.findOne({'_member_id': _member_id}, callback);
}

var exports = {
    save: save,
    read: read
};

module.exports = exports;
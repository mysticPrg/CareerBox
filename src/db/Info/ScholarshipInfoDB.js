/**
 * Created by careerBox on 2014-12-16.
 */

var requirejs = require('../../require.config');
var ScholarshipInfo = requirejs('classes/Info/ScholarshipInfo');

var async = require('async');
var ObjectID = require('mongodb').ObjectID;

function save(data, callback) {
    var scholarshipInfoCollection = require('../../util/DBCollections').getInstance().collections.scholarshipInfo;

    var scholarshipInfoInfo = new ScholarshipInfo(data);
    scholarshipInfoInfo._id = new ObjectID(scholarshipInfoInfo._id);

    scholarshipInfoCollection.save(scholarshipInfoInfo, function(err, savedCount, result) {
        var returnObject = null;
        if ( result.updatedExisting ) {
            returnObject = scholarshipInfoInfo;
        } else {
            returnObject = result.upserted[0];
        }
        callback(err, returnObject);
    });
}

function read(_member_id, callback) {
    var scholarshipInfoCollection = require('../../util/DBCollections').getInstance().collections.scholarshipInfo;

    scholarshipInfoCollection.findOne({'_member_id': _member_id}, callback);
}

var exports = {
    save: save,
    read: read
};

module.exports = exports;
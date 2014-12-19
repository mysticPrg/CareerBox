/**
 * Created by careerBox on 2014-12-16.
 */

var requirejs = require('../../require.config');
var HighSchoolInfo = requirejs('classes/Info/HighSchoolInfo');

var async = require('async');
var ObjectID = require('mongodb').ObjectID;

function saveList(data, callback) {
    var highSchoolInfoCollection = require('../../util/DBCollections').getInstance().collections.highSchoolInfo;

    var highSchoolInfo = new HighSchoolInfo(data);
    highSchoolInfo._id = new ObjectID(highSchoolInfo._id);

    highSchoolInfoCollection.save(highSchoolInfo, function(err, savedCount, result) {
        var returnObject = null;
        if ( result.updatedExisting ) {
            returnObject = highSchoolInfo;
        } else {
            returnObject = result.upserted[0];
        }
        callback(err, returnObject);
    });
}

function readList(_member_id, callback) {
    var highSchoolInfoCollection = require('../../util/DBCollections').getInstance().collections.highSchoolInfo;

    highSchoolInfoCollection.findOne({'_member_id': _member_id}, callback);
}

function reset() {
    var highSchoolInfoCollection = require('../../util/DBCollections').getInstance().collections.highSchoolInfo;
    highSchoolInfoCollection.remove({}, function() {
        return;
    });
}

var exports = {
    saveList: saveList,
    readList: readList,
    reset: reset
};

module.exports = exports;

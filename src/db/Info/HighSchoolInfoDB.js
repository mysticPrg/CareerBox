/**
 * Created by careerBox on 2014-12-16.
 */

var requirejs = require('../../require.config');
var HighSchoolInfo = requirejs('classes/Info/HighSchoolInfo');

var async = require('async');
var ObjectID = require('mongodb').ObjectID;

function save(data, callback) {
    var highSchoolInfoCollection = require('../../util/DBCollections').getInstance().collections.highSchoolInfo;
    var highSchoolInfo = new HighSchoolInfo(data);
    highSchoolInfo._id = new ObjectID(highSchoolInfo._id);

    highSchoolInfoCollection.save(highSchoolInfo, function(err, savedCount, result) {
        callback(err, result.upserted[0]);
    });
}

function readList(_member_id, callback) {
    var highSchoolInfoCollection = require('../../util/DBCollections').getInstance().collections.highSchoolInfo;

    highSchoolInfoCollection.find({'_member_id': _member_id}).toArray(function(err, arr) {
        callback(err, arr);
    });
}


var exports = {
    save: save,
    readList: readList
};

module.exports = exports;

/**
 * Created by careerBox on 2014-12-16.
 */

var requirejs = require('../../require.config');
var UnivSchoolInfo = requirejs('classes/Info/UnivSchoolInfo');

var async = require('async');
var ObjectID = require('mongodb').ObjectID;

function save(data, callback) {
    var univSchoolInfoCollection = require('../../util/DBCollections').getInstance().collections.univSchoolInfo;
    var univSchoolInfo = new UnivSchoolInfo(data);
    univSchoolInfo._id = new ObjectID(univSchoolInfo._id);

    univSchoolInfoCollection.save(univSchoolInfo, function(err, savedCount, result) {
        callback(err, result.upserted[0]);
    });
}

function readList(_member_id, callback) {
    var univSchoolInfoCollection = require('../../util/DBCollections').getInstance().collections.univSchoolInfo;

    univSchoolInfoCollection.find({'_member_id': _member_id}).toArray(function(err, arr) {
        callback(err, arr);
    });
}


var exports = {
    save: save,
    readList: readList
};

module.exports = exports;

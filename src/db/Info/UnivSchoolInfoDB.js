/**
 * Created by careerBox on 2014-12-16.
 */

var requirejs = require('../../require.config');
var UnivSchoolInfo = requirejs('classes/Info/UnivSchoolInfo');

var async = require('async');
var ObjectID = require('mongodb').ObjectID;

function saveList(data, callback) {
    var univSchoolInfoCollection = require('../../util/DBCollections').getInstance().collections.univSchoolInfo;

    var univSchoolInfo = new UnivSchoolInfo(data);
    univSchoolInfo._id = new ObjectID(univSchoolInfo._id);

    univSchoolInfoCollection.save(univSchoolInfo, function(err, savedCount, result) {
        var returnObject = null;
        if ( result.updatedExisting ) {
            returnObject = univSchoolInfo;
        } else {
            returnObject = result.upserted[0];
        }
        callback(err, returnObject);
    });
}

function readList(_member_id, callback) {
    var univSchoolInfoCollection = require('../../util/DBCollections').getInstance().collections.univSchoolInfo;

    univSchoolInfoCollection.findOne({'_member_id': _member_id}, callback);
}


var exports = {
    saveList: saveList,
    readList: readList
};

module.exports = exports;
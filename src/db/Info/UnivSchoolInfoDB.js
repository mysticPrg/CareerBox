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

    for ( var i=0 ; i<univSchoolInfo.items.length ; i++ ) {
        if (!univSchoolInfo.items[i]._id) {
            univSchoolInfo.items[i]._id = new ObjectID();
        }
    }

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

function reset() {
    var univSchoolInfoCollection = require('../../util/DBCollections').getInstance().collections.univSchoolInfo;
    univSchoolInfoCollection.remove({}, function() {
        return;
    });
}

var exports = {
    saveList: saveList,
    readList: readList,
    reset: reset
};

module.exports = exports;

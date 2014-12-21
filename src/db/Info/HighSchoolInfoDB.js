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

    for ( var i=0 ; i<highSchoolInfo.items.length ; i++ ) {
        if (!highSchoolInfo.items[i]._id) {
            highSchoolInfo.items[i]._id = new ObjectID().toHexString();
        }
    }

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

function useCheck(_member_id, _item_id, callback) {
    var awardInfoCollection = require('../../util/DBCollections').getInstance().collections.awardInfo;

    awardInfoCollection.findOne({
        '_member_id': _member_id,
        'items': {$elemMatch: {_id: _item_id}}
    }, function(err, finded) {
        if ( finded ) {
            callback(err, true);
        } else {
            callback(err, false);
        }
    });
}

function reset() {
    var highSchoolInfoCollection = require('../../util/DBCollections').getInstance().collections.highSchoolInfo;
    highSchoolInfoCollection.remove({}, function() {
        return;
    });
}

var exports = {
    save: saveList,
    read: readList,
    useCheck: useCheck,
    reset: reset
};

module.exports = exports;

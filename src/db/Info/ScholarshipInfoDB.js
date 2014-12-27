/**
 * Created by careerBox on 2014-12-16.
 */

var requirejs = require('../../require.config');
var ScholarshipInfo = requirejs('classes/Info/ScholarshipInfo');

var ObjectID = require('mongodb').ObjectID;

function save(data, callback) {
    var scholarshipInfoCollection = require('../../util/DBCollections').getInstance().collections.scholarshipInfo;

    var scholarshipInfoInfo = new ScholarshipInfo(data);
    scholarshipInfoInfo._id = new ObjectID(scholarshipInfoInfo._id);

    for ( var i=0 ; i<scholarshipInfoInfo.items.length ; i++ ) {
        if (!scholarshipInfoInfo.items[i]._id) {
            scholarshipInfoInfo.items[i]._id = new ObjectID().toHexString();
        }
    }

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
    var scholarshipInfoCollection = require('../../util/DBCollections').getInstance().collections.scholarshipInfo;
    scholarshipInfoCollection.remove({}, function() {
    });
}

var exports = {
    save: save,
    read: read,
    useCheck: useCheck,
    reset: reset
};

module.exports = exports;
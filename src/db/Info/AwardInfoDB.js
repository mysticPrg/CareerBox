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

    for ( var i=0 ; i<awardInfo.items.length ; i++ ) {
        if (!awardInfo.items[i]._id) {
            awardInfo.items[i]._id = new ObjectID().toHexString();
        }
    }

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
    var awardInfoCollection = require('../../util/DBCollections').getInstance().collections.awardInfo;
    awardInfoCollection.remove({}, function() {
        return;
    });
}

var exports = {
    save: save,
    read: read,
    useCheck: useCheck,
    reset: reset
};

module.exports = exports;
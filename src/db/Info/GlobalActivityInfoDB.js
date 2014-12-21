/**
 * Created by careerBox on 2014-12-16.
 */

var requirejs = require('../../require.config');
var GlobalActivityInfo = requirejs('classes/Info/GlobalActivityInfo');

var async = require('async');
var ObjectID = require('mongodb').ObjectID;

function save(data, callback) {
    var globalActivityInfoCollection = require('../../util/DBCollections').getInstance().collections.globalActivityInfo;

    var globalActivityInfo = new GlobalActivityInfo(data);
    globalActivityInfo._id = new ObjectID(globalActivityInfo._id);

    for ( var i=0 ; i<globalActivityInfo.items.length ; i++ ) {
        if (!globalActivityInfo.items[i]._id) {
            globalActivityInfo.items[i]._id = new ObjectID().toHexString();
        }
    }

    globalActivityInfoCollection.save(globalActivityInfo, function(err, savedCount, result) {
        var returnObject = null;
        if ( result.updatedExisting ) {
            returnObject = globalActivityInfo;
        } else {
            returnObject = result.upserted[0];
        }
        callback(err, returnObject);
    });
}

function read(_member_id, callback) {
    var globalActivityInfoCollection = require('../../util/DBCollections').getInstance().collections.globalActivityInfo;

    globalActivityInfoCollection.findOne({'_member_id': _member_id}, callback);
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
    var globalActivityInfoCollection = require('../../util/DBCollections').getInstance().collections.globalActivityInfo;
    globalActivityInfoCollection.remove({}, function() {
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
/**
 * Created by careerBox on 2014-12-16.
 */

var requirejs = require('../../require.config');
var LocalActivityInfo = requirejs('classes/Info/LocalActivityInfo');

var ObjectID = require('mongodb').ObjectID;

function save(data, callback) {
    var localActivityInfoCollection = require('../../util/DBCollections').getInstance().collections.localActivityInfo;

    var localActivityInfo = new LocalActivityInfo(data);
    localActivityInfo._id = new ObjectID(localActivityInfo._id);

    for ( var i=0 ; i<localActivityInfo.items.length ; i++ ) {
        if (!localActivityInfo.items[i]._id) {
            localActivityInfo.items[i]._id = new ObjectID().toHexString();
        }
    }

    localActivityInfoCollection.save(localActivityInfo, function(err, savedCount, result) {
        var returnObject = null;
        if ( result.updatedExisting ) {
            returnObject = localActivityInfo;
        } else {
            returnObject = result.upserted[0];
        }
        callback(err, returnObject);
    });
}

function read(_member_id, callback) {
    var localActivityInfoCollection = require('../../util/DBCollections').getInstance().collections.localActivityInfo;

    localActivityInfoCollection.findOne({'_member_id': _member_id}, callback);
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
    var localActivityInfoCollection = require('../../util/DBCollections').getInstance().collections.localActivityInfo;
    localActivityInfoCollection.remove({}, function() {
    });
}

var exports = {
    save: save,
    read: read,
    useCheck: useCheck,
    reset: reset
};

module.exports = exports;
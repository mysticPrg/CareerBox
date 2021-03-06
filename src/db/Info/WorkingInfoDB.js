/**
 * Created by careerBox on 2014-12-16.
 */

var requirejs = require('../../require.config');
var WorkingInfo = requirejs('classes/Info/WorkingInfo');

var ObjectID = require('mongodb').ObjectID;

function save(data, callback) {
    var workingInfoCollection = require('../../util/DBCollections').getInstance().collections.workingInfo;

    var workingInfo = new WorkingInfo(data);
    workingInfo._id = new ObjectID(workingInfo._id);

    for ( var i=0 ; i<workingInfo.items.length ; i++ ) {
        if (!workingInfo.items[i]._id) {
            workingInfo.items[i]._id = new ObjectID().toHexString();
        }
    }

    workingInfoCollection.save(workingInfo, function(err, savedCount, result) {
        var returnObject = null;
        if ( result.updatedExisting ) {
            returnObject = workingInfo;
        } else {
            returnObject = result.upserted[0];
        }
        callback(err, returnObject);
    });
}

function read(_member_id, callback) {
    var workingInfoCollection = require('../../util/DBCollections').getInstance().collections.workingInfo;

    workingInfoCollection.findOne({'_member_id': _member_id}, callback);
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
    var workingInfoCollection = require('../../util/DBCollections').getInstance().collections.workingInfo;
    workingInfoCollection.remove({}, function() {
    });
}

var exports = {
    save: save,
    read: read,
    useCheck: useCheck,
    reset: reset
};

module.exports = exports;
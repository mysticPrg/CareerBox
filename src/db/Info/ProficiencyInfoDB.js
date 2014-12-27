/**
 * Created by careerBox on 2014-12-16.
 */

var requirejs = require('../../require.config');
var ProficiencyInfo = requirejs('classes/Info/ProficiencyInfo');

var ObjectID = require('mongodb').ObjectID;

function save(data, callback) {
    var proficiencyInfoCollection = require('../../util/DBCollections').getInstance().collections.proficiencyInfo;

    var proficiencyInfo = new ProficiencyInfo(data);
    proficiencyInfo._id = new ObjectID(proficiencyInfo._id);

    for ( var i=0 ; i<proficiencyInfo.items.length ; i++ ) {
        if (!proficiencyInfo.items[i]._id) {
            proficiencyInfo.items[i]._id = new ObjectID().toHexString();
        }
    }

    proficiencyInfoCollection.save(proficiencyInfo, function(err, savedCount, result) {
        var returnObject = null;
        if ( result.updatedExisting ) {
            returnObject = proficiencyInfo;
        } else {
            returnObject = result.upserted[0];
        }
        callback(err, returnObject);
    });
}

function read(_member_id, callback) {
    var proficiencyInfoCollection = require('../../util/DBCollections').getInstance().collections.proficiencyInfo;

    proficiencyInfoCollection.findOne({'_member_id': _member_id}, callback);
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
    var proficiencyInfoCollection = require('../../util/DBCollections').getInstance().collections.proficiencyInfo;
    proficiencyInfoCollection.remove({}, function() {
    });
}

var exports = {
    save: save,
    read: read,
    useCheck: useCheck,
    reset: reset
};

module.exports = exports;

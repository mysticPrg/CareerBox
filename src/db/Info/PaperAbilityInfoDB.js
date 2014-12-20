/**
 * Created by careerBox on 2014-12-16.
 */

var requirejs = require('../../require.config');
var PaperAbilityInfo = requirejs('classes/Info/PaperAbilityInfo');

var async = require('async');
var ObjectID = require('mongodb').ObjectID;

function save(data, callback) {
    var paperAbilityInfoCollection = require('../../util/DBCollections').getInstance().collections.paperAbilityInfo;

    var paperAbilityInfo = new PaperAbilityInfo(data);
    paperAbilityInfo._id = new ObjectID(paperAbilityInfo._id);

    for ( var i=0 ; i<paperAbilityInfo.items.length ; i++ ) {
        if (!paperAbilityInfo.items[i]._id) {
            paperAbilityInfo.items[i]._id = new ObjectID();
        }
    }

    paperAbilityInfoCollection.save(paperAbilityInfo, function(err, savedCount, result) {
        var returnObject = null;
        if ( result.updatedExisting ) {
            returnObject = paperAbilityInfo;
        } else {
            returnObject = result.upserted[0];
        }
        callback(err, returnObject);
    });
}

function read(_member_id, callback) {
    var paperAbilityInfoCollection = require('../../util/DBCollections').getInstance().collections.paperAbilityInfo;

    paperAbilityInfoCollection.findOne({'_member_id': _member_id}, callback);
}

function reset() {
    var paperAbilityInfoCollection = require('../../util/DBCollections').getInstance().collections.paperAbilityInfo;
    paperAbilityInfoCollection.remove({}, function() {
        return;
    });
}

var exports = {
    save: save,
    read: read,
    reset: reset
};

module.exports = exports;
/**
 * Created by careerBox on 2014-12-16.
 */

var requirejs = require('../../require.config');
var ProficiencyInfo = requirejs('classes/Info/ProficiencyInfo');

var async = require('async');
var ObjectID = require('mongodb').ObjectID;

function save(data, callback) {
    var proficiencyInfoCollection = require('../../util/DBCollections').getInstance().collections.proficiencyInfo;

    var proficiencyInfo = new ProficiencyInfo(data);
    proficiencyInfo._id = new ObjectID(proficiencyInfo._id);

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

function reset() {
    var proficiencyInfoCollection = require('../../util/DBCollections').getInstance().collections.proficiencyInfo;
    proficiencyInfoCollection.remove({}, function() {
        return;
    });
}

var exports = {
    save: save,
    read: read,
    reset: reset
};

module.exports = exports;

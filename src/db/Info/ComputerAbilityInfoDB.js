/**
 * Created by careerBox on 2014-12-16.
 */

var requirejs = require('../../require.config');
var ComputerAbilityInfo = requirejs('classes/Info/ComputerAbilityInfo');

var async = require('async');
var ObjectID = require('mongodb').ObjectID;

function save(data, callback) {
    var computerAbilityInfoCollection = require('../../util/DBCollections').getInstance().collections.computerAbilityInfo;

    var computerAbilityInfo = new ComputerAbilityInfo(data);
    computerAbilityInfo._id = new ObjectID(computerAbilityInfo._id);

    computerAbilityInfoCollection.save(computerAbilityInfo, function(err, savedCount, result) {
        var returnObject = null;
        if ( result.updatedExisting ) {
            returnObject = computerAbilityInfo;
        } else {
            returnObject = result.upserted[0];
        }
        callback(err, returnObject);
    });
}

function read(_member_id, callback) {
    var computerAbilityInfoCollection = require('../../util/DBCollections').getInstance().collections.computerAbilityInfo;

    computerAbilityInfoCollection.findOne({'_member_id': _member_id}, callback);
}

var exports = {
    save: save,
    read: read
};

module.exports = exports;
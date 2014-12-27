/**
 * Created by careerBox on 2014-12-15.
 */

var requirejs = require('../../require.config');
var PersonalInfo = requirejs('classes/Info/PersonalInfo');

var ObjectID = require('mongodb').ObjectID;

function save(data, callback) {
    var personalInfoCollection = require('../../util/DBCollections').getInstance().collections.personalInfo;

    var personalInfo = new PersonalInfo(data);
    personalInfo._id = new ObjectID(personalInfo._id);

    for ( var i=0 ; i<personalInfo.items.length ; i++ ) {
        if (!personalInfo.items[i]._id) {
            personalInfo.items[i]._id = new ObjectID().toHexString();
        }
    }

    personalInfoCollection.save(personalInfo, function(err, savedCount, result) {
        var returnObject = null;
        if ( result.updatedExisting ) {
            returnObject = personalInfo;
        } else {
            returnObject = result.upserted[0];
        }
        callback(err, returnObject);
    });
}

function read(_member_id, callback) {
    var personalInfoCollection = require('../../util/DBCollections').getInstance().collections.personalInfo;

    personalInfoCollection.findOne({'_member_id': _member_id}, callback);
}

function reset() {
    var personalInfoCollection = require('../../util/DBCollections').getInstance().collections.personalInfo;
    personalInfoCollection.remove({}, function() {
    });
}

var exports = {
    save: save,
    read: read,
    reset: reset
};

module.exports = exports;

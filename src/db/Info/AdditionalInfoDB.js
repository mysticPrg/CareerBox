/**
 * Created by careerBox on 2014-12-16.
 */

var requirejs = require('../../require.config');
var AdditionalInfo = requirejs('classes/Info/AdditionalInfo');

var async = require('async');
var ObjectID = require('mongodb').ObjectID;

function save(data, callback) {
    var additionalInfoCollection = require('../../util/DBCollections').getInstance().collections.additionalInfo;
    var additionalInfo = new AdditionalInfo(data);
    additionalInfo._id = new ObjectID(additionalInfo._id);

    additionalInfoCollection.save(additionalInfo, function(err, savedCount, result) {
        var returnVal = null;
        if ( result.updatedExisting ) {
            returnVal = additionalInfo;
        } else {
            returnVal = result.upserted[0];
        }
        callback(err, returnVal);
    });
}

function read(_member_id, callback) {
    var additionalInfoCollection = require('../../util/DBCollections').getInstance().collections.additionalInfo;

    additionalInfoCollection.findOne({'_member_id': _member_id}, callback);
}

function reset() {
    var additionalInfoCollection = require('../../util/DBCollections').getInstance().collections.additionalInfo;
    additionalInfoCollection.remove({}, function() {
        return;
    });
}


var exports = {
    save: save,
    read: read,
    reset: reset
};

module.exports = exports;

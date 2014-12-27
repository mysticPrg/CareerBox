/**
 * Created by careerBox on 2014-12-16.
 */

var requirejs = require('../../require.config');
var AdditionalInfo = requirejs('classes/Info/AdditionalInfo');

var ObjectID = require('mongodb').ObjectID;

function save(data, callback) {
    var additionalInfoCollection = require('../../util/DBCollections').getInstance().collections.additionalInfo;

    var additionalInfo = new AdditionalInfo(data);
    additionalInfo._id = new ObjectID(additionalInfo._id);

    for ( var i=0 ; i<additionalInfo.items.length ; i++ ) {
        if (!additionalInfo.items[i]._id) {
            additionalInfo.items[i]._id = new ObjectID().toHexString();
        }
    }

    additionalInfoCollection.save(additionalInfo, function(err, savedCount, result) {
        var returnObject = null;
        if ( result.updatedExisting ) {
            returnObject = additionalInfo;
        } else {
            returnObject = result.upserted[0];
        }
        callback(err, returnObject);
    });
}

function read(_member_id, callback) {
    var additionalInfoCollection = require('../../util/DBCollections').getInstance().collections.additionalInfo;

    additionalInfoCollection.findOne({'_member_id': _member_id}, callback);
}

function reset() {
    var additionalInfoCollection = require('../../util/DBCollections').getInstance().collections.additionalInfo;
    additionalInfoCollection.remove({}, function() {
    });
}


var exports = {
    save: save,
    read: read,
    reset: reset
};

module.exports = exports;

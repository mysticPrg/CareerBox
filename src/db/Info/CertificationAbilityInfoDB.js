/**
 * Created by careerBox on 2014-12-16.
 */

var requirejs = require('../../require.config');
var CertificationAbilityInfo = requirejs('classes/Info/CertificationAbilityInfo');

var ObjectID = require('mongodb').ObjectID;

function save(data, callback) {
    var certificationAbilityInfoCollection = require('../../util/DBCollections').getInstance().collections.certificationAbilityInfo;

    var certificationAbilityInfo = new CertificationAbilityInfo(data);
    certificationAbilityInfo._id = new ObjectID(certificationAbilityInfo._id);

    for ( var i=0 ; i<certificationAbilityInfo.items.length ; i++ ) {
        if (!certificationAbilityInfo.items[i]._id) {
            certificationAbilityInfo.items[i]._id = new ObjectID().toHexString();
        }
    }

    certificationAbilityInfoCollection.save(certificationAbilityInfo, function(err, savedCount, result) {
        var returnObject = null;
        if ( result.updatedExisting ) {
            returnObject = certificationAbilityInfo;
        } else {
            returnObject = result.upserted[0];
        }
        callback(err, returnObject);
    });
}

function read(_member_id, callback) {
    var certificationAbilityInfoCollection = require('../../util/DBCollections').getInstance().collections.certificationAbilityInfo;

    certificationAbilityInfoCollection.findOne({'_member_id': _member_id}, callback);
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
    var certificationAbilityInfoCollection = require('../../util/DBCollections').getInstance().collections.certificationAbilityInfo;
    certificationAbilityInfoCollection.remove({}, function() {
    });
}

var exports = {
    save: save,
    read: read,
    useCheck: useCheck,
    reset: reset
};

module.exports = exports;

/**
 * Created by careerBox on 2014-12-16.
 */

var requirejs = require('../../require.config');
var CertificationAbilityInfo = requirejs('classes/Info/CertificationAbilityInfo');

var async = require('async');
var ObjectID = require('mongodb').ObjectID;

function save(data, callback) {
    var certificationAbilityInfoCollection = require('../../util/DBCollections').getInstance().collections.certificationAbilityInfo;

    var certificationAbilityInfo = new CertificationAbilityInfo(data);
    certificationAbilityInfo._id = new ObjectID(certificationAbilityInfo._id);

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

function reset() {
    var certificationAbilityInfoCollection = require('../../util/DBCollections').getInstance().collections.certificationAbilityInfo;
    certificationAbilityInfoCollection.remove({}, function() {
        return;
    });
}

var exports = {
    save: save,
    read: read,
    reset: reset
};

module.exports = exports;

/**
 * Created by careerBox on 2014-12-16.
 */

var requirejs = require('../../require.config');
var CertificationAbilityInfo = requirejs('classes/Info/CertificationAbilityInfo');

var async = require('async');
var ObjectID = require('mongodb').ObjectID;

function save(data, callback) {
    var CertificationAbilityInfoCollection = require('../../util/DBCollections').getInstance().collections.certificationAbilityInfo;
    var certificationAbilityInfo = new CertificationAbilityInfo(data);
    certificationAbilityInfo._id = new ObjectID(certificationAbilityInfo._id);

    CertificationAbilityInfoCollection.save(certificationAbilityInfo, function(err, savedCount, result) {
        callback(err, result.upserted[0]);
    });
}

function readList(_member_id, callback) {
    var CertificationAbilityInfoCollection = require('../../util/DBCollections').getInstance().collections.certificationAbilityInfo;

    CertificationAbilityInfoCollection.find({'_member_id': _member_id}).toArray(function(err, arr) {
        callback(err, arr);
    });
}


var exports = {
    save: save,
    readList: readList
};

module.exports = exports;

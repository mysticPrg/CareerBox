/**
 * Created by careerBox on 2014-12-15.
 */

var requirejs = require('../../require.config');
var PersonalInfo = requirejs('classes/Info/PersonalInfo');

var async = require('async');
var ObjectID = require('mongodb').ObjectID;

function save(data, callback) {
    var personalInfoCollection = require('../../util/DBCollections').getInstance().collections.personalInfo;
    var personalInfo = new PersonalInfo(data);
    personalInfo._id = new ObjectID(personalInfo._id);

    personalInfoCollection.save(personalInfo, function(err, savedCount, result) {
        callback(err, result.upserted[0]);
    });
}

function read(_member_id, callback) {
    var personalInfoCollection = require('../../util/DBCollections').getInstance().collections.personalInfo;

    personalInfoCollection.findOne({'_member_id': _member_id}, callback);
}


var exports = {
    save: save,
    read: read
};

module.exports = exports;

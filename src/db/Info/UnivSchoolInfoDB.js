/**
 * Created by careerBox on 2014-12-16.
 */

var requirejs = require('../../require.config');
var UnivSchoolInfo = requirejs('classes/Info/UnivSchoolInfo');

var async = require('async');
var ObjectID = require('mongodb').ObjectID;

function saveList(arrData, callback) {
    var univSchoolInfoCollection = require('../../util/DBCollections').getInstance().collections.univSchoolInfo;

    async.each(arrData, function (data, cb) {
        var univSchoolInfo = new UnivSchoolInfo(arrData);
        univSchoolInfo._id = new ObjectID(univSchoolInfo._id);

        univSchoolInfoCollection.save(univSchoolInfo, cb);
    }, function (err) {
        callback(err);
    });
}

function readList(_member_id, callback) {
    var univSchoolInfoCollection = require('../../util/DBCollections').getInstance().collections.univSchoolInfo;

    univSchoolInfoCollection.find({'_member_id': _member_id}).toArray(function(err, arr) {
        callback(err, arr);
    });
}


var exports = {
    saveList: saveList,
    readList: readList
};

module.exports = exports;

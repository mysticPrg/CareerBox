/**
 * Created by careerBox on 2014-12-16.
 */

var requirejs = require('../../require.config');
var HighSchoolInfo = requirejs('classes/Info/HighSchoolInfo');

var async = require('async');
var ObjectID = require('mongodb').ObjectID;

function saveList(arrData, callback) {
    var highSchoolInfoCollection = require('../../util/DBCollections').getInstance().collections.highSchoolInfo;

    async.each(arrData, function (data, cb) {
        var highSchoolInfo = new HighSchoolInfo(data);
        highSchoolInfo._id = new ObjectID(highSchoolInfo._id);

        highSchoolInfoCollection.save(highSchoolInfo, cb);
    }, function (err) {
        callback(err);
    });
}

function readList(_member_id, callback) {
    var highSchoolInfoCollection = require('../../util/DBCollections').getInstance().collections.highSchoolInfo;

    highSchoolInfoCollection.find({'_member_id': _member_id}).toArray(function(err, arr) {
        callback(err, arr);
    });
}


var exports = {
    saveList: saveList,
    readList: readList
};

module.exports = exports;

/**
 * Created by careerBox on 2014-12-16.
 */

var requirejs = require('../../require.config');
var WorkingInfo = requirejs('classes/Info/WorkingInfo');

var async = require('async');
var ObjectID = require('mongodb').ObjectID;

function save(data, callback) {
    var workingInfoCollection = require('../../util/DBCollections').getInstance().collections.workingInfo;
    var workingInfo = new WorkingInfo(data);
    workingInfo._id = new ObjectID(workingInfo._id);

    workingInfoCollection.save(workingInfo, callback);
}

function readList(_member_id, callback) {
    var workingInfoCollection = require('../../util/DBCollections').getInstance().collections.workingInfo;

    workingInfoCollection.find({'_member_id': _member_id}).toArray(function(err, arr) {
        callback(err, arr);
    });
}

var exports = {
    save: save,
    readList: readList
};

module.exports = exports;
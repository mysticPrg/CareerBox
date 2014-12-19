/**
 * Created by careerBox on 2014-12-16.
 */

var requirejs = require('../../require.config');
var ProjectInfo = requirejs('classes/Info/ProjectInfo');

var async = require('async');
var ObjectID = require('mongodb').ObjectID;

function save(data, callback) {
    var projectInfoCollection = require('../../util/DBCollections').getInstance().collections.projectInfo;

    var projectInfo = new ProjectInfo(data);
    projectInfo._id = new ObjectID(projectInfo._id);

    projectInfoCollection.save(projectInfo, function(err, savedCount, result) {
        var returnObject = null;
        if ( result.updatedExisting ) {
            returnObject = projectInfo;
        } else {
            returnObject = result.upserted[0];
        }
        callback(err, returnObject);
    });
}

function read(_member_id, callback) {
    var projectInfoCollection = require('../../util/DBCollections').getInstance().collections.projectInfo;

    projectInfoCollection.findOne({'_member_id': _member_id}, callback);
}

function reset() {
    var projectInfoCollection = require('../../util/DBCollections').getInstance().collections.projectInfo;
    projectInfoCollection.remove({}, function() {
        return;
    });
}

var exports = {
    save: save,
    read: read,
    reset: reset
};

module.exports = exports;
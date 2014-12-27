/**
 * Created by careerBox on 2014-12-16.
 */

var requirejs = require('../../require.config');
var UnivSchoolInfo = requirejs('classes/Info/UnivSchoolInfo');

var ObjectID = require('mongodb').ObjectID;

function saveList(data, callback) {
    var univSchoolInfoCollection = require('../../util/DBCollections').getInstance().collections.univSchoolInfo;

    var univSchoolInfo = new UnivSchoolInfo(data);
    univSchoolInfo._id = new ObjectID(univSchoolInfo._id);

    for ( var i=0 ; i<univSchoolInfo.items.length ; i++ ) {
        if (!univSchoolInfo.items[i]._id) {
            univSchoolInfo.items[i]._id = new ObjectID().toHexString();
        }
    }

    univSchoolInfoCollection.save(univSchoolInfo, function(err, savedCount, result) {
        var returnObject = null;
        if ( result.updatedExisting ) {
            returnObject = univSchoolInfo;
        } else {
            returnObject = result.upserted[0];
        }
        callback(err, returnObject);
    });
}

function readList(_member_id, callback) {
    var univSchoolInfoCollection = require('../../util/DBCollections').getInstance().collections.univSchoolInfo;

    univSchoolInfoCollection.findOne({'_member_id': _member_id}, callback);
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
    var univSchoolInfoCollection = require('../../util/DBCollections').getInstance().collections.univSchoolInfo;
    univSchoolInfoCollection.remove({}, function() {
    });
}

var exports = {
    save: saveList,
    read: readList,
    useCheck: useCheck,
    reset: reset
};

module.exports = exports;

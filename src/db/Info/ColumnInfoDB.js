/**
 * Created by careerBox on 2014-12-16.
 */

var requirejs = require('../../require.config');
var ColumnInfo = requirejs('classes/Info/ColumnInfo');

var ObjectID = require('mongodb').ObjectID;

function save(data, callback) {
    var columnInfoCollection = require('../../util/DBCollections').getInstance().collections.columnInfo;

    var columnInfo = new ColumnInfo(data);
    columnInfo._id = new ObjectID(columnInfo._id);

    for ( var i=0 ; i<columnInfo.items.length ; i++ ) {
        if (!columnInfo.items[i]._id) {
            columnInfo.items[i]._id = new ObjectID().toHexString();
        }
    }

    columnInfoCollection.save(columnInfo, function(err, savedCount, result) {
        var returnObject = null;
        if ( result.updatedExisting ) {
            returnObject = columnInfo;
        } else {
            returnObject = result.upserted[0];
        }
        callback(err, returnObject);
    });
}

function read(_member_id, callback) {
    var columnInfoCollection = require('../../util/DBCollections').getInstance().collections.columnInfo;

    columnInfoCollection.findOne({'_member_id': _member_id}, callback);
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
    var columnInfoCollection = require('../../util/DBCollections').getInstance().collections.columnInfo;
    columnInfoCollection.remove({}, function() {
    });
}

var exports = {
    save: save,
    read: read,
    useCheck: useCheck,
    reset: reset
};

module.exports = exports;
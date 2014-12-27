/**
 * Created by mysticPrg on 2014-10-09.
 */

var async = require('async');

function DBHelper() {
//	this.server = new mongodb.Server('localhost', 27017, {auto_reconnect: true});
    this.client = require('mongodb').MongoClient;
    this.db = null;
    this.url = 'mongodb://localhost:27017/careerbox';
}

DBHelper.prototype.connect = function connect(callback) {
    if (this.db !== null) {
        callback(null, this.db);
        return;
    }

    var self = this;

    this.client.connect(this.url, function (err, db) {
        console.log('connected to mongo db');
        self.db = db;
        callback(err, db);
    });
};

DBHelper.prototype.connectAndOpen = function connectAndOpen(collectionName, callback) {

    var self = this;

    try {
        async.waterfall([
            function (cb) { // openDB
                self.connect(cb);
            }
        ], function sendResult(err, db) {
            if (err) {
                console.log(err.message);
                return;
            }
            db.collection(collectionName, callback);
        });
    } catch (err) {
        console.log(err.message);
    }

};

DBHelper.prototype.close = function close() {
    if (this.db) {
        this.db.close();
        this.db = null;
    }
};

module.exports = DBHelper;
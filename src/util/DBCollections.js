/**
 * Created by careerBox on 2014-11-20.
 */

var async = require('async');
var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/careerbox';


var _instance = null;

var DBCollections = {
    getInstance: function () {
        if (!_instance) {
            _instance = new _DBCollections();
        }

        return _instance;
    }
};

function _DBCollections() {

    this.isOpen = false;
    this.db = null;
    this.collections = {
        member: null,
        paper: null,
        portfolio: null,
        template: null,

        member2: null,
        template2: null
    };
}

_DBCollections.prototype.open = function open(callback) {
    var self = this;

    if (!self.isOpen) {
        MongoClient.connect(url, function (err, db) {
            self.db = db;

            self.collections.member = db.collection('member');
            self.collections.paper = db.collection('paper');
            self.collections.portfolio = db.collection('portfolio');
            self.collections.template = db.collection('template');

            self.collections.member2 = db.collection('member2');
            self.collections.template2 = db.collection('template2');

            self.isOpen = true;

            if (callback) {
                callback();
            }
        });
    }
};

_DBCollections.prototype.close = function close() {
    if (this.isOpen && this.db) {
        this.db.close();
        this.collections = {
            member: null,
            paper: null,
            portfolio: null,
            template: null,
            member2: null,
            template2: null
        };
    }
};

module.exports = DBCollections;
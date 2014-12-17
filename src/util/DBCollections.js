/**
 * Created by careerBox on 2014-11-20.
 */

var async = require('async');
var MongoClient = require('mongodb').MongoClient;
var GridStore = require('mongodb').GridStore;

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
    this.store = {
        read: null,
        write: null
    };
    this.collections = {
        member: null,
        paper: null,
        portfolio: null,
        template: null,

        personalInfo: null,
        additionalInfo: null,
        highSchoolInfo: null,
        univSchoolInfo: null,
        workingInfo: null,

        certificationAbilityInfo: null,
        proficiencyInfo: null,
        computerAbilityInfo: null,
        paperAbilityInfo: null,

        scholarshipInfo: null,
        awardInfo: null,

        localActivityInfo: null,
        globalActivityInfo: null,

        projectInfo: null,
        columnInfo: null,

        file: null,
        image: null
    };
}

_DBCollections.prototype.open = function open(callback) {
    var self = this;

    if (!self.isOpen) {
        MongoClient.connect(url, function (err, db) {
            self.db = db;

            self.store.read = new GridStore(db, null, null, 'r');
            self.store.write = new GridStore(db, null, null, 'w');

            self.collections.member = db.collection('member');
            self.collections.paper = db.collection('paper');
            self.collections.portfolio = db.collection('portfolio');
            self.collections.template = db.collection('template');

            self.collections.personalInfo = db.collection('personalInfo');
            self.collections.additionalInfo = db.collection('additionalInfo');
            self.collections.highSchoolInfo = db.collection('highSchoolInfo');
            self.collections.univSchoolInfo = db.collection('univSchoolInfo');
            self.collections.workingInfo = db.collection('workingInfo');

            self.collections.certificationAbilityInfo = db.collection('certificationAbilityInfo');
            self.collections.proficiencyInfo = db.collection('proficiencyInfo');
            self.collections.computerAbilityInfo = db.collection('computerAbilityInfo');
            self.collections.paperAbilityInfo = db.collection('paperAbilityInfo');

            self.collections.scholarshipInfo = db.collection('scholarshipInfo');
            self.collections.awardInfo = db.collection('awardInfo');

            self.collections.localActivityInfo = db.collection('localActivityInfo');
            self.collections.globalActivityInfo = db.collection('globalActivityInfo');

            self.collections.projectInfo = db.collection('projectInfo');
            self.collections.columnInfo = db.collection('columnInfo');

            self.collections.file = db.collection('file');
            self.collections.image = db.collection('image');

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
        this.store = {
            read: null,
            write: null
        };
        this.collections = {
            member: null,
            paper: null,
            portfolio: null,
            template: null,

            personalInfo: null,
            additionalInfo: null,
            highSchoolInfo: null,
            univSchoolInfo: null,
            workingInfo: null,

            certificationAbilityInfo: null,
            proficiencyInfo: null,
            computerAbilityInfo: null,
            paperAbilityInfo: null,

            scholarshipInfo: null,
            awardInfo: null,

            localActivityInfo: null,
            globalActivityInfo: null,

            projectInfo: null,
            columnInfo: null,

            file: null,
            image: null
        };
    }
};

module.exports = DBCollections;
/**
 * Created by careerBox on 2014-10-25.
 */

var testPort = 8223;

var server;
var member = require('../../src/services/member');
var paper = require('../../src/services/paper');

var request = require('request');
var async = require('async');
var ObjectID = require('mongodb').ObjectID;

var serverUrl = 'http://210.118.74.166:8223';

var ItemDao = require('../../src/dao/itemDao');

describe('User of Sprint#0', function () {

    beforeEach(function () {
        server = require('../../src/services/server');

        member.set(server);
        paper.set(server);
        server.start(testPort);
    });

    it('join to CareerBox', function (done) {

        var newMember = {
            email: 'forTest@test.com',
            password: '123456'
        };

        request.post({
                url: serverUrl + '/member/join',
                json: newMember,
                method: 'POST'
            },
            function (err, res, body) {
                expect(body.returnCode).toEqual('000');

                try {
                    async.waterfall([
                        function (callback) { // Open DB
                            server.dbhelper.connect(callback);
                        },
                        function (db, callback) { // Open Collection
                            db.collection('member', callback);
                        },
                        function (collection, callback) { // find ID and Pass
                            collection.findOne({email: newMember.email}, function (err, result) {
                                callback(err, collection, result);
                            });
                        },
                        function (collection, findMember, callback) { // check ID and Pass
                            expect(findMember.email).toEqual(newMember.email);
                            expect(findMember.password).toEqual(newMember.password);
                            callback(null, collection);
                        },
                        function (collection, callback) { // remove ID
                            collection.remove({email: newMember.email}, callback);
                        }
                    ], function checkErr(err) {
                        if (err) {
                            throw  err;
                        }
                    });
                } catch (e) {
                    console.log(e.message);
                } finally {
                    done();
                }
            });
    });


    it('can do login and logout', function (done) {

        var user = {
            email: 'test@test.com',
            password: '1234'
        };

        try {
            async.waterfall([
                function (callback) { // request login
                    request.post({
                        url: serverUrl + '/member/login',
                        json: user,
                        method: 'POST'
                    }, callback);
                },
                function (res, body, callback) { // login check
                    expect(body.returnCode).toEqual('000');
                    expect(res.headers['set-cookie'][0]).toContain('connect.sid');
                    callback(null);
                },
                function (callback) { // request logout
                    request.get({
                        url: serverUrl + '/member/logout',
                        json: {},
                        method: 'GET'
                    }, callback);
                },
                function (res, body, callback) { // logout check
                    expect(body.returnCode).toEqual('000');
                    callback(null);
                }
            ], function (err) {
                if (err) {
                    throw err;
                }
                done();
            });
        } catch (e) {
            console.log(e.message);
            done();
        }
    });

    it('can do save and load the paper', function (done) {
        var dbBackup = null;
        var user = {
            _id: null,
            email: 'test@test.com',
            password: '1234'
        };

        var paper = {
            items: [
                new ItemDao({
                    _id: '1',
                    type: 'text',
                    pos: {
                        x: 100,
                        y: 150
                    },
                    size: {
                        width: 250,
                        height: 200
                    }
                }),
                new ItemDao({
                    _id: '2',
                    type: 'image',
                    pos: {
                        x: 100,
                        y: 150
                    },
                    size: {
                        width: 250,
                        height: 200
                    }
                })
            ]
        };

        try {
            async.waterfall([
                function (callback) { // request login
                    request.post({
                        url: serverUrl + '/member/login',
                        json: user,
                        method: 'POST',
                        jar: true
                    }, callback);
                },
                function (res, body, callback) { // login check
                    expect(body.returnCode).toEqual('000');
                    expect(res.headers['set-cookie'][0]).toContain('connect.sid');
                    callback(null);
                },
                function (callback) { // request save
                    request.post({
                        url: serverUrl + '/paper',
                        json: paper,
                        method: 'POST',
                        jar: true
                    }, callback);
                },
                function (res, body, callback) { // save check
                    expect(body.returnCode).toEqual('000');
                    callback(null);
                },
                function (callback) { // Open DB
                    server.dbhelper.connect(callback);
                },
                function (db, callback) { // Open member collection
                    dbBackup = db;
                    db.collection('member', callback);
                },
                function (collection, callback) { // find ID and Pass
                    collection.findOne({email: user.email}, function (err, result) {
                        callback(err, collection, result);
                    });
                },
                function (collection, findMember, callback) { // check ID and Pass
                    expect(findMember.email).toEqual(user.email);
                    expect(findMember.password).toEqual(user.password);
                    user._id = new ObjectID(findMember._id).toHexString();
                    callback();
                },
                function (callback) { // open paper collection
                    dbBackup.collection('paper', callback);
                },
                function (collection, callback) { // find paper
                    collection.findOne({_id: user._id}, callback);
                },
                function (findPaper, callback) { // check paper
                    expect(findPaper.items['1']).toEqual(paper.items[0]);
                    callback();
                }
            ], function (err) {
                if (err) {
                    throw err;
                }
                done();
            });
        } catch (e) {
            console.log(e.message);
            done();
        }
    });

    afterEach(function () {
        if (server) {
            server.close();
            server = null;
        }
    });
});
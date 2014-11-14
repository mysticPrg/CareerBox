/**
 * Created by mysticPrg on 2014-09-22.
 * Provider for Paper Service
 */

var async = require('async');

var Result = require('./result');
var genID = require('./../util/genID');

var requirejs = require('../require.config');

var Member = requirejs('classes/Member');

var ItemDao = require('./../dao/itemDao');
//var paperDao = require('./dao/paperDao');

var _server = null;

module.exports.set = function (server) {
    server.post('/fortfolio/paper', save);
    server.get('/fortpaper', load);

    _server = server;

//	server.put('/paper', update);
//	server.delete('/paper', del);
};

function save(req, res) {
    var session = req.session;
    var result = new Result(null);

    res.writeHead(200, {
        'Content-Type': 'application/json'
    });

    if (!session._id) {
        result.setCode('002');
        res.end(result.toString());
        return;
    }

    try {
        async.waterfall([
            function (callback) { // openDB
                _server.dbhelper.connect(callback);
            },
            function (db, callback) { // openCollection
                db.collection('paper', function (err, collection) {
                    callback(err, collection, session._id);
                });
            },
            existCheck,
            create,
            function (collection, callback) { // doUpdate
                update(collection, session._id, req.body.items, callback);
            },
            del
        ], function sendResult(err) {
            if (err) {
                console.log(err.message);
                return;
            }

            var result = new Result(null);
            res.end(result.toString());

            _server.dbhelper.close();
        });
    } catch (err) {
        console.log(err.message);
    }
}

function existCheck(collection, _id, callback) {
    collection.findOne({_id: _id}, function (err, paper) {
        callback(err, collection, paper, _id);
    });
}

function create(collection, paper, _id, callback) {
    if (!paper) {
        collection.insert({
            _id: _id,
            items: {}
        }, null, function (err) {
            callback(err, collection);
        });
    } else {
        callback(null, collection);
    }
}

function update(collection, _id, items, callback) {
    var newItems = {};

    for (var key in items) {
        var item = items[key];

        if (item.state === 'new') {
            item._id = genID();
        } else if (item.state === 'del:') {
            continue;
        }

        var str = "items." + item._id;
        newItems[str] = new ItemDao(item);
    }

    collection.update(
        {_id: _id},
        {$set: newItems},
        function (err) {
            callback(err, collection, _id, items);
        }
    );
}

function del(collection, _id, items, callback) {
    var delItems = [];

    for (var key in items) {
        if (items[key].state === 'del') {
            delItems.push(items[key]);
        }
    }

    async.each(delItems, function (item, callback) {
        collection.update(
            {_id: _id},
            {$unset: 'items.' + item.id},
            callback
        );
    }, function (e) {
        callback(e);
    });
}

function load(req, res) {
    var session = req.session;
    var result = new Result(null);

    res.writeHead(200, {
        'Content-Type': 'application/json'
    });

    if (!session._id) {
        result.setCode('002');
        res.end(result.toString());
        return;
    }

    try {
        async.waterfall([
            function openDB(callback) {
                _server.dbhelper.connect(callback);
            },
            function openCollection(db, callback) {
                db.collection('paper', function (err, collection) {
                    callback(err, collection, session._id);
                });
            },
            existCheck,
            function doLoad(collection, paper, _id, callback) {
                var result = new Result(null);

                result.result = [];

                if (paper) {
                    for (var key in paper.items) {
                        result.result.push(paper.items[key]);
                    }
                }

                callback(null, result);
            }
        ], function sendResult(err, result) {
            if (err) {
                console.log(err.message);
                return;
            }

            res.end(result.toString());

            _server.dbhelper.close();
        });
    } catch (err) {
        console.log(err.message);
    }
}

//function update(req, res) {
//
//}
//
//function del(req, res) {
//
//}
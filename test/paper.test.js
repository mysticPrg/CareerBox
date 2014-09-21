/**
 * Created by mysticPrg on 2014-09-22.
 */

var should = require('should');
var http = require('http');

var paper = require('../src/paper');
var itemDao = require('../src/itemDao');
var server = require('../src/server');

var httpTestHelper = require('./httpTestHelper');

describe('Paper', function () {
	before(function () {
		paper.set(server);

		server.start(8123);
	});

	it('can be save', function (done) {
		function assertFunc(res) {
			res.on('data', function(data) {
				var json = JSON.parse(data)	;

				json.should.be.a.Array.and.length(2);
				json[0].type.should.be.exactly('text');
				done();
			});

			res.statusCode.should.be.exactly(200);
		}

		var data = new Array();
		var dao = new itemDao('text');
		dao.content = 'hello world';
		data.push(dao);

		dao = new itemDao('image');
		dao.content = 'hello.jpg';
		data.push(dao);

		httpTestHelper.make('localhost', 8123, '/paper', 'POST', assertFunc);
		httpTestHelper.send(data, done);
	});

	after(function () {
		server.close();
	});
});
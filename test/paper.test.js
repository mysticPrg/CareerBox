/**
 * Created by mysticPrg on 2014-09-22.
 */

var should = require('should');
var http = require('http');

var paper = require('../src/paper');
var server = require('../src/server');

var paperDao = require('../src/dao/paperDao');
var itemDao = require('../src/dao/itemDao');

var HttpTestHelper = require('./httpTestHelper');

var port = 8124;

describe('Paper', function () {
	before(function () {
		paper.set(server);

		server.start(port);
	});

	it('Save and Load', function (done) {
		var paper = new paperDao();
		var item = new itemDao('text');
		item.content = 'hello text';
		paper.add(item);

		item = new itemDao('image');
		item.content = 'hello image';
		paper.add(item);

		new HttpTestHelper('localhost', port, '/paper', 'POST', function (res) {
			res.on('data', function (data) {
				var result = JSON.parse(data);
				result.returnCode.should.be.exactly('000');
				result.result.should.be.ok;
			});
			res.statusCode.should.be.exactly(200);
		}).send(paper, done);

		new HttpTestHelper('localhost', port, '/paper', 'GET', function (res) {
			res.on('data', function (data) {
				var result = JSON.parse(data);
				result.returnCode.should.be.exactly('000');

				result.result.should.eql(paper);
				done();
			});
			res.statusCode.should.be.exactly(200);
		}).send(null, done);
	});

	after(function () {
		server.close();
	});
});
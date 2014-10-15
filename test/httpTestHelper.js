/**
 * Created by mysticPrg on 2014-09-22.
 */

var http = require('http');

var HttpTestHelper = function HttpTestHelper(host, port, path, method, test) {
	this.req = http.request({
		host: host,
		port: port,
		path: path,
		method: method,
		headers: {
			'Content-Type': 'application/json'
		}
	}, test);
};

HttpTestHelper.prototype.send = function (data, done) {
	if (this.req === null)
		return;

	this.req.on('error', function (e) {
		e.should.not.ok();
		console.log(e.message);
		done();
	});

	this.req.write(JSON.stringify(data));
	this.req.end();
};

module.exports = HttpTestHelper;

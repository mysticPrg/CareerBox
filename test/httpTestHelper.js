/**
 * Created by mysticPrg on 2014-09-22.
 */

var http = require('http');

var req = null;

module.exports.make = function (host, port, path, method, test) {
	req = http.request({
		host: host,
		port: port,
		path: path,
		method: method,
		headers: {
			'Content-Type': 'application/json'
		}
	}, test);
};

module.exports.send = function (data, done) {
	if (req === null)
		return;

	req.on('error', function (e) {
		e.should.not.ok();
		done();
	});

	req.write(JSON.stringify(data));
	req.end();
};
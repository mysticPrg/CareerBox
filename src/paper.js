/**
 * Created by mysticPrg on 2014-09-22.
 */


module.exports.set = function (server) {
	server.post('/paper', function (req, res) {
		save(req, res);
	});

	server.get('/paper', function (req, res) {

	});

	server.put('/paper', function (req, res) {

	});

	server.delete('/paper', function (req, res) {

	});
};

function save(req, res) {
	res.end(JSON.stringify(req.body));
}

function load(req, res) {

}
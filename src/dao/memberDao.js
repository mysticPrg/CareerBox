/**
 * Created by mysticPrg on 2014-10-09.
 */

var memberDao = function memberDao(data) {
	this._id = null;
	this.email = '';
	this.password = '';

	if (data) {
		if (data._id) {
            this._id = data._id;
        }

		if (data.email) {
            this.email = data.email;
        }

		if (data.password) {
            this.password = data.password;
        }
	}

};

module.exports = memberDao;
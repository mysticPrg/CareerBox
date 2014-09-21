/**
 * Created by mysticPrg on 2014-09-22.
 */

var itemDao = function itemDao(type) {
	this.type = type;
	this.content = '';
	this.pos = {
		x: 0,
		y: 0
	};
	this.size = {
		width: 100,
		height: 40
	}
};

module.exports = itemDao;
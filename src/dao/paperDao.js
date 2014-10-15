/**
 * Created by mysticPrg on 2014-09-22.
 */

var paperDao = function paperDao() {
	this._id = null;
	this.items = new Array();
};

paperDao.prototype.add = function add(itemDao) {
	this.items.push(itemDao);
};

paperDao.prototype.remove = function remove(itemId) {
};

module.exports = paperDao;
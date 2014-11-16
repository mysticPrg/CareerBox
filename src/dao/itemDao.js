/**
 * Created by mysticPrg on 2014-09-22.
 */

var itemDao = function itemDao(data) {

    this._id = data._id ? data._id : null;
    this.itemType = data.itemType ? data.itemType : null;
    this.pos = data.pos ? data.pos : {x: 0, y: 0};
    this.size = data.size ? data.size : {x: 100, y: 100};
};

module.exports = itemDao;
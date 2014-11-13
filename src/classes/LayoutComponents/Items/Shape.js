/**
 * Created by careerBox on 2014-11-11.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Util',
    'classes/LayoutComponents/Items/Item'
], function (Util, Item) {

    function Shape() {
        Item.call(this);
    };

    Util.inherit(Shape, Item);

    return Shape;
});
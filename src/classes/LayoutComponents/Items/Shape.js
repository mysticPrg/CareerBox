/**
 * Created by careerBox on 2014-11-11.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Util',
    'classes/Enums/ShapeType',
    'classes/LayoutComponents/Items/Item'
], function (Util, ShapeType, Item) {

    function Shape() {
        Item.call(this);

        this.shapeType = ShapeType.box;
    };

    Util.inherit(Shape, Item);

    return Shape;
});
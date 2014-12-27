/**
 * Created by careerBox on 2014-11-11.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Util',
    'classes/Enums/ShapeType',
    'classes/Enums/ItemType',
    'classes/LayoutComponents/Items/Item'
], function (Util, ShapeType, ItemType, Item) {

    function Shape(props) {
        Item.call(this, props);

        this.itemType = ItemType.shape;
        this.shapeType = ShapeType.box;

        if (props) {
            this.shapeType = props.shapeType ? props.shapeType : this.shapeType;
        }
    }

    Util.inherit(Shape, Item);

    return Shape;
});
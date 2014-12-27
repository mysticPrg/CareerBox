/**
 * Created by careerBox on 2014-11-12.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Util',
    'classes/Structs/Arrow',
    'classes/Structs/Position',
    'classes/Enums/ItemType',
    'classes/LayoutComponents/Items/Item'
], function (Util, Arrow, Position, ItemType, Item) {

    function Line(props) {
        Item.call(this, props);

        this.itemType = ItemType.line;
        this.arrow = new Arrow();
        this.pos_start = new Position();
        this.pos_end = new Position();

        if (props) {
            this.arrow = new Arrow(props.arrow ? props.arrow : this.arrow);
            this.pos_start = new Position(props.pos_start ? props.pos_start : this.pos_start);
            this.pos_end = new Position(props.pos_end ? props.pos_end : this.pos_end);
        }
    }

    Util.inherit(Line, Item);

    return Line;
});
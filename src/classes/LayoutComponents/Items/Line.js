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
    'classes/LayoutComponents/Items/Item'
], function (Util, Arrow, Position, Item) {

    function Line() {
        Item.call(this);

        this.arrow = new Arrow();
        this.pos_start = new Position();
        this.pos_end = new Position();
    };

    Util.inherit(Line, Item);

    return Line;
});
/**
 * Created by careerBox on 2014-11-11.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Util',
    'classes/LayoutComponents/Items/Item',
    'classes/Enums/Align',
    'classes/Enums/VerticalAlign',
    'classes/Structs/Font'
], function (Util, Item, Align, VerticalAlign, Font) {

    function Text() {
        Item.call(this);

        this.value = 'Text';
        this.font = new Font();
        this.align = Align.left;
        this.vAlign = VerticalAlign.middle;
    };

    Util.inherit(Text, Item);

    return Text;
});
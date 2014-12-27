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
    'classes/Enums/ItemType',
    'classes/Structs/Font'
], function (Util, Item, Align, VerticalAlign, ItemType, Font) {

    function Text(props) {
        Item.call(this, props);

        this.itemType = ItemType.text;
        this.value = 'Text';
        this.font = new Font();
        this.align = Align.left;
        this.vAlign = VerticalAlign.middle;

        if (props) {
            this.value = props.value ? props.value : this.value;
            this.font = new Font(props.font ? props.font : this.font);
            this.align = props.align ? props.align : this.align;
            this.vAlign = props.vAlign ? props.vAlign : this.vAlign;
        }
    }

    Util.inherit(Text, Item);

    return Text;
});

/**
 * Created by careerBox on 2014-11-15.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Util',
    'classes/Enums/IconType',
    'classes/Enums/ItemType',
    'classes/LayoutComponents/Items/Item'
], function (Util, IconType, ItemType, Item) {

    function Icon(props) {
        Item.call(this, props);

        this.itemType = ItemType.icon;
        this.iconType = IconType.asterisk;

        if (props) {
            this.iconType = props.iconType ? props.iconType : this.iconType;
        }
    };

    Util.inherit(Icon, Item);

    return Icon;
});
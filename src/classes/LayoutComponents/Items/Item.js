/**
 * Created by careerBox on 2014-11-11.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Util',
    'classes/Enums/ItemType',
    'classes/LayoutComponents/LayoutComponent'
], function (Util, ItemType, LayoutComponent) {

    function Item() {
        LayoutComponent.call(this);

        this.itemType = ItemType.shape;
    };

    Util.inherit(Item, LayoutComponent);

    return Item;
});
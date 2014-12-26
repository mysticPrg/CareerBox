/**
 * Created by careerBox on 2014-11-11.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Util',
    'classes/Enums/ItemType',
    'classes/Enums/LayoutComponentType',
    'classes/LayoutComponents/LayoutComponent',
    'classes/Info/InfoClass'
], function (Util, ItemType, LayoutComponentType, LayoutComponent) {

    function Item(props) {
        LayoutComponent.call(this, props);

        this.layoutComponentType = LayoutComponentType.item;
        this.itemType = ItemType.shape;
        this.rotate = 0;

        if (props) {
            this.itemType = props.itemType ? props.itemType : this.itemType;
            this.rotate = Number((props.rotate!==undefined) ? props.rotate : this.rotate);
        }
    };

    Util.inherit(Item, LayoutComponent);

    return Item;
});
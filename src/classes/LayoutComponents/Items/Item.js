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
    'classes/Structs/Outline',
    'classes/Structs/Fill'
], function (Util, ItemType, LayoutComponentType, LayoutComponent, Outline, Fill) {

    function Item(props) {
        LayoutComponent.call(this, props);

        this.layoutComponentType = LayoutComponentType.item;
        this.itemType = ItemType.shape;

        this.fill = new Fill();
        this.outline = new Outline();
        this.radius = 0;
        this.rotate = 0;
        this.alpha = 100;

        if (props) {
            this.itemType = props.itemType ? props.itemType : this.itemType;
            this.fill = props.fill ? props.fill : this.fill;
            this.outline = props.outline ? props.outline : this.outline;
            this.radius = props.radius ? props.radius : this.radius;
            this.rotate = props.rotate ? props.rotate : this.rotate;
            this.alpha = props.alpha ? props.alpha : this.alpha;
        }
    };

    Util.inherit(Item, LayoutComponent);

    return Item;
});
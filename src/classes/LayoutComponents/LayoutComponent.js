/**
 * Created by careerBox on 2014-11-12.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Structs/Size',
    'classes/Structs/Position',
    'classes/Structs/Outline',
    'classes/Structs/Fill',
    'classes/Enums/LayoutComponentType'
], function (Size, Position, Outline, Fill, LayoutComponentType) {

    function LayoutComponent(props) {
        this._id = null;
        this.layoutComponentType = LayoutComponentType.item;
        this.zOrder = 0;
        this.size = new Size();
        this.pos = new Position();
        this.fill = new Fill();
        this.outline = new Outline();
        this.radius = 0;

        if (props) {
            this._id = props._id ? props._id : this._id;
            this.layoutComponentType = props.layoutComponentType ? props.layoutComponentType : this.layoutComponentType;
            this.zOrder = props.zOrder ? props.zOrder : this.zOrder;
            this.size = props.size ? props.size : this.size;
            this.pos = props.pos ? props.pos : this.pos;
            this.fill = props.fill ? props.fill : this.fill;
            this.outline = props.outline ? props.outline : this.outline;
            this.radius = props.radius ? props.radius : this.radius;
        }
    };

    return LayoutComponent;
});
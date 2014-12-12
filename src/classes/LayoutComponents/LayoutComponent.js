/**
 * Created by careerBox on 2014-11-12.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Structs/Size',
    'classes/Structs/Position',
    'classes/Enums/LayoutComponentType'
], function (Size, Position, Outline, Fill, LayoutComponentType) {

    function LayoutComponent(props) {
        this._id = null;
        this.zOrder = 0;
        this.size = new Size();
        this.pos = new Position();
        this.layoutComponentType = LayoutComponentType.item;

        if (props) {
            this._id = props._id ? props._id : this._id;
            this.zOrder = props.zOrder ? props.zOrder : this.zOrder;
            this.size = props.size ? props.size : this.size;
            this.pos = props.pos ? props.pos : this.pos;
            this.layoutComponentType = props.layoutComponentType ? props.layoutComponentType : this.layoutComponentType;
        }
    };

    return LayoutComponent;
});
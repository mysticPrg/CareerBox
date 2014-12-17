/**
 * Created by careerBox on 2014-12-17.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Enums/PrimitiveTypeEnum'
], function (PrimitiveTypeEnum) {

    function PrimitiveType(props) {

        this._id = null;
        this.primitiveTypeEnum = PrimitiveTypeEnum.string;
        this.value = null;
        this.title = '';

        if (props) {
            this._id = props._id ? props._id : this._id;
            this.primitiveTypeEnum = props.primitiveTypeEnum ? props.primitiveTypeEnum : this.primitiveTypeEnum;
            this.value = props.value ? props.value : this.value;
            this.title = props.title ? props.title : this.title;
        }
    };

    return PrimitiveType;
});
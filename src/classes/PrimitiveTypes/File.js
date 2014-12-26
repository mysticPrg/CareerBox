/**
 * Created by careerBox on 2014-12-17.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Util',
    'classes/PrimitiveTypes/PrimitiveType',
    'classes/Enums/PrimitiveTypeEnum',
], function (Util, PrimitiveType, PrimitiveTypeEnum) {

    function File(props) {
        PrimitiveType.call(this, props);
        this.primitiveTypeEnum = PrimitiveTypeEnum.file;

        this._member_id = null;
        this.originalName = '';
        this.name = '';
        this.filesize = 0;
        this.isBinding = false; // article에 바인딩 된 file인지 여부 (독립적으로 리스트 제공해야 하는지)

        if (props) {
            this._member_id = props._member_id ? props._member_id : this._member_id;
            this.originalName = props.originalName ? props.originalName : this.originalName;
            this.name = props.name ? props.name : this.name;
            this.filesize = (props.filesize!==undefined) ? props.filesize : this.filesize;
            this.isBinding = (props.isBinding!==undefined) ? props.isBinding : this.isBinding;
        }
    };

    Util.inherit(File, PrimitiveType);

    return File;
});
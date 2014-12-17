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
        this.path = '';
        this.filesize = 0;
        this.url = '';

        if (props) {
            this._member_id = props._member_id ? props._member_id : this._member_id;
            this.originalName = props.originalName ? props.originalName : this.originalName;
            this.path = props.path ? props.path : this.path;
            this.filesize = props.filesize ? props.filesize : this.filesize;
            this.url = props.url ? props.url : this.url;
        }
    };

    Util.inherit(File, PrimitiveType);

    return File;
});
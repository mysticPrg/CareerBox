/**
 * Created by careerBox on 2014-12-18.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Util',
    'classes/PrimitiveTypes/File',
    'classes/Enums/PrimitiveTypeEnum',
    'classes/Structs/Size',
], function (Util, File, PrimitiveTypeEnum, Size) {

    function Image(props) {
        File.call(this, props);
        this.primitiveTypeEnum = PrimitiveTypeEnum.image;

        this.size = new Size();
        this.thumbPath = '';
        this.thumbSize = new Size();
        this.fitSize = false;

        if (props) {
            this.size = props.size ? props.size : this.size;
            this.thumbPath = props.thumbPath ? props.thumbPath : this.thumbPath;
            this.thumbSize = props.thumbSize ? props.thumbSize : this.thumbSize;
            this.fitSize = props.fitSize ? props.fitSize : this.fitSize;
        }
    };

    Util.inherit(Image, File);

    return Image;
});
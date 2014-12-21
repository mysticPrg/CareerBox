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
        this.fitSize = false;

        if (props) {
            this.size = new Size(props.size ? props.size : this.size);
            this.fitSize = props.fitSize ? props.fitSize : this.fitSize;
        }
    };

    Util.inherit(Image, File);

    return Image;
});
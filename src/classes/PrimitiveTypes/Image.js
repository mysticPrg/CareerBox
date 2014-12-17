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
], function (Util, File, PrimitiveTypeEnum) {

    function Image(props) {
        File.call(this, props);
        this.primitiveTypeEnum = PrimitiveTypeEnum.image;



        if (props) {
        }
    };

    Util.inherit(Image, File);

    return Image;
});
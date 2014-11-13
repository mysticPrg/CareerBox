/**
 * Created by careerBox on 2014-11-11.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Util',
    'classes/LayoutComponents/Items/Item'
], function (Util, Item) {

    function Image() {
        Item.call(this);

        this.name = '';
        this.thumbnail = '';
    };

    Util.inherit(Image, Item);

    return Image;
});
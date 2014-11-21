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

    function Image(props) {
        Item.call(this, props);

        this.name = '';
        this.thumbnail = '';

        if (props) {
            this.name = props.name ? props.name : this.name;
            this.thumbnail = props.thumbnail ? props.thumbnail : this.thumbnail;
        }
    };

    Util.inherit(Image, Item);

    return Image;
});
/**
 * Created by careerBox on 2014-11-11.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Util',
    'classes/Enums/ItemType',
    'classes/LayoutComponents/Items/Text'

], function (Util, ItemType, Text) {

    function Link(props) {
        Text.call(this, props);

        this.itemType = ItemType.link;
        this.name = '';
        this.url = 'about:blank';
        this.isOutURL = true;
        this.isNewWindow = false;

        if (props) {
            this.name = props.name ? props.name : this.name;
            this.url = props.url ? props.url : this.url;
            this.isOutURL = (props.isOutURL!==undefined) ? props.isOutURL : this.isOutURL;
            this.isNewWindow = (props.isNewWindow!==undefined) ? props.isNewWindow : this.isNewWindow;
        }
    };

    Util.inherit(Link, Text);

    return Link;
});

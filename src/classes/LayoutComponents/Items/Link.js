/**
 * Created by careerBox on 2014-11-11.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Util',
    'classes/LayoutComponents/Items/Text'

], function (Util, Text) {

    function Link(props) {
        Text.call(this, props);

        this.name = '';
        this.url = 'about:blank';

        if (props) {
            this.name = props.name ? props.name : this.name;
            this.url = props.url ? props.url : this.url;
        }
    };

    Util.inherit(Link, Text);

    return Link;
});

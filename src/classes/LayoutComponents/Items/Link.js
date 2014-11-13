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

    function Link() {
        Text.call(this);

        this.name = '';
        this.url = 'about:blank';
    };

    Util.inherit(Link, Text);

    return Link;
});
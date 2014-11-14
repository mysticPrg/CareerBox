/**
 * Created by careerBox on 2014-11-15.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Util',
    'classes/Enums/IconType',
    'classes/LayoutComponents/Items/Item'
], function (Util, IconType, Item) {

    function Icon() {
        Item.call(this);

        this.type = IconType.asterisk;
    };

    Util.inherit(Icon, Item);

    return Icon;
});
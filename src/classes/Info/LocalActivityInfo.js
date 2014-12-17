/**
 * Created by careerBox on 2014-12-16.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Util',
    'classes/Info/InfoClass',
    'classes/Info/LocalActivityInfoItem',
    'classes/Enums/InfoType'
], function (Util, InfoClass, LocalActivityInfoItem, InfoType) {

    function LocalActivityInfo(props) {

        InfoClass.call(this, props);

        this.infoType = InfoType.localActivityInfo;
        this.items = [];

        if ( props && props.items ) {
            var newItems = [];
            for ( var i=0 ; i<props.items.length ; i++ ) {
                newItems.push(new LocalActivityInfoItem(props.items[i]));
            }

            this.items = newItems;
        }
    }

    Util.inherit(LocalActivityInfo, InfoClass);

    return LocalActivityInfo;
});
/**
 * Created by careerBox on 2014-12-16.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Util',
    'classes/Info/InfoClass',
    'classes/Info/GlobalActivityInfoItem',
    'classes/Enums/InfoType'
], function (Util, InfoClass, GlobalActivityInfoItem, InfoType) {

    function GlobalActivityInfo(props) {

        InfoClass.call(this, props);

        this.title = '해외활동';
        this.infoType = InfoType.globalActivityInfo;
        this.items = [];

        if ( props && props.items ) {
            var newItems = [];
            for ( var i=0 ; i<props.items.length ; i++ ) {
                newItems.push(new GlobalActivityInfoItem(props.items[i]));
            }

            this.items = newItems;
        }
    }

    Util.inherit(GlobalActivityInfo, InfoClass);

    return GlobalActivityInfo;
});
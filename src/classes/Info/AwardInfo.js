/**
 * Created by careerBox on 2014-12-16.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Util',
    'classes/Info/InfoClass',
    'classes/Info/AwardInfoItem',
    'classes/Enums/InfoType'
], function (Util, InfoClass, AwardInfoItem, InfoType) {

    function AwardInfo(props) {

        InfoClass.call(this, props);

        this.infoType = InfoType.awardInfo;
        this.items = [];

        if ( props && props.items ) {
            var newItems = [];
            for ( var i=0 ; i<props.items.length ; i++ ) {
                newItems.push(new AwardInfoItem(props.items[i]));
            }

            this.items = newItems;
        }
    }

    Util.inherit(AwardInfo, InfoClass);

    return AwardInfo;
});
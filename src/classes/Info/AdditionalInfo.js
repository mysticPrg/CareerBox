/**
 * Created by careerBox on 2014-12-16.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Util',
    'classes/Info/InfoClass',
    'classes/Info/AdditionalInfoItem',
    'classes/Enums/InfoType',
], function (Util, InfoClass, AdditionalInfoItem, InfoType) {

    function AdditionalInfo(props) {

        InfoClass.call(this, props);

        this.title = '추가정보';
        this.infoType = InfoType.additionalInfo;
        this.items = [];

        if ( props && props.items ) {
            var newItems = [];
            for ( var i=0 ; i<props.items.length ; i++ ) {
                newItems.push(new AdditionalInfoItem(props.items[i]));
            }

            this.items = newItems;
        }
    }

    Util.inherit(AdditionalInfo, InfoClass);

    return AdditionalInfo;
});
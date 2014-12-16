/**
 * Created by careerBox on 2014-12-16.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Util',
    'classes/Info/InfoClass',
    'classes/Info/ScholarshipInfoItem',
    'classes/Enums/InfoType'
], function (Util, InfoClass, ScholarshipInfoItem, InfoType) {

    function ScholarshipInfo(props) {

        InfoClass.call(this, props);

        this.infoType = InfoType.scholarshipInfo;
        this.items = [];

        if ( props && props.items ) {
            var newItems = [];
            for ( var i=0 ; i<props.items.length ; i++ ) {
                newItems.push(new ScholarshipInfoItem(props.items[i]));
            }

            this.items = newItems;
        }
    }

    Util.inherit(ScholarshipInfo, InfoClass);

    return ScholarshipInfo;
});
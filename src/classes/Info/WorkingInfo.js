/**
 * Created by careerBox on 2014-12-16.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Util',
    'classes/Info/InfoClass',
    'classes/Info/WorkingInfoItem',
    'classes/Enums/InfoType'
], function (Util, InfoClass, WorkingInfoItem, InfoType) {

    function WorkingInfo(props) {

        InfoClass.call(this, props);

        this.title = '경력';
        this.infoType = InfoType.workingInfo;
        this.items = [];

        if ( props && props.items ) {
            var newItems = [];
            for ( var i=0 ; i<props.items.length ; i++ ) {
                newItems.push(new WorkingInfoItem(props.items[i]));
            }

            this.items = newItems;
        }
    }

    Util.inherit(WorkingInfo, InfoClass);

    return WorkingInfo;
});
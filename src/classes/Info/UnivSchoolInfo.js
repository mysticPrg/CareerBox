/**
 * Created by careerBox on 2014-12-16.
 */


if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Util',
    'classes/Info/InfoClass',
    'classes/Info/UnivSchoolInfoItem',
    'classes/Enums/InfoType'
], function (Util, InfoClass, UnivSchoolInfoItem, InfoType) {

    function UnivSchoolInfo(props) {

        InfoClass.call(this, props);

        this.infoType = InfoType.univSchoolInfo;
        this.items = [];

        if ( props && props.items ) {
            var newItems = [];
            for ( var i=0 ; i<props.items.length ; i++ ) {
                newItems.push(new UnivSchoolInfoItem(props.items[i]));
            }

            this.items = newItems;
        }
    }

    Util.inherit(UnivSchoolInfo, InfoClass);

    return UnivSchoolInfo;
});
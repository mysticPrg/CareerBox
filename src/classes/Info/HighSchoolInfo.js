/**
 * Created by careerBox on 2014-12-16.
 */


if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Util',
    'classes/Info/InfoClass',
    'classes/Info/HighSchoolInfoItem',
    'classes/Enums/InfoType'
], function (Util, InfoClass, HighSchoolInfoItem, InfoType) {

    function HighSchoolInfo(props) {

        InfoClass.call(this, props);

        this.title = '고등학교';
        this.infoType = InfoType.highSchoolInfo;
        this.items = [];

        if ( props && props.items ) {
            var newItems = [];
            for ( var i=0 ; i<props.items.length ; i++ ) {
                newItems.push(new HighSchoolInfoItem(props.items[i]));
            }

            this.items = newItems;
        }
    }

    Util.inherit(HighSchoolInfo, InfoClass);

    return HighSchoolInfo;
});
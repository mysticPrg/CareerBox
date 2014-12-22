/**
 * Created by careerBox on 2014-12-15.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Util',
    'classes/Info/InfoClass',
    'classes/Info/PersonalInfoItem',
    'classes/Enums/InfoType'
], function (Util, InfoClass, PersonalInfoItem, InfoType) {

    function PersonalInfo(props) {

        InfoClass.call(this, props);

        this.title = '기본정보';
        this.infoType = InfoType.personalInfo;
        this.items = [];

        if ( props && props.items ) {
            var newItems = [];
            for ( var i=0 ; i<props.items.length ; i++ ) {
                newItems.push(new PersonalInfoItem(props.items[i]));
            }

            this.items = newItems;
        }
    }

    Util.inherit(PersonalInfo, InfoClass);

    return PersonalInfo;
});
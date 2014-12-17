/**
 * Created by careerBox on 2014-12-17.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Util',
    'classes/Info/InfoClass',
    'classes/Info/ProficiencyInfoItem',
    'classes/Enums/InfoType'
], function (Util, InfoClass, ProficiencyInfoItem, InfoType) {

    function ProficiencyInfo(props) {

        InfoClass.call(this, props);

        this.title = '외국어능력';
        this.infoType = InfoType.proficiencyInfo;
        this.items = [];

        if ( props && props.items ) {
            var newItems = [];
            for ( var i=0 ; i<props.items.length ; i++ ) {
                newItems.push(new ProficiencyInfoItem(props.items[i]));
            }

            this.items = newItems;
        }
    }

    Util.inherit(ProficiencyInfo, InfoClass);

    return ProficiencyInfo;
});
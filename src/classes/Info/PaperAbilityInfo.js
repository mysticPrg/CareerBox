/**
 * Created by careerBox on 2014-12-16.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Util',
    'classes/Info/InfoClass',
    'classes/Info/PaperAbilityInfoItem',
    'classes/Enums/InfoType'
], function (Util, InfoClass, PaperAbilityInfoItem, InfoType) {

    function PaperAbilityInfo(props) {

        InfoClass.call(this, props);

        this.infoType = InfoType.paperAbilityInfo;
        this.items = [];

        if ( props && props.items ) {
            var newItems = [];
            for ( var i=0 ; i<props.items.length ; i++ ) {
                newItems.push(new PaperAbilityInfoItem(props.items[i]));
            }

            this.items = newItems;
        }
    }

    Util.inherit(PaperAbilityInfo, InfoClass);

    return PaperAbilityInfo;
});
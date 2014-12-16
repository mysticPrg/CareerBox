/**
 * Created by careerBox on 2014-12-16.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Util',
    'classes/Info/InfoClass',
    'classes/Info/ComputerAbilityInfoItem',
    'classes/Enums/InfoType'
], function (Util, InfoClass, ComputerAbilityInfoItem, InfoType) {

    function ComputerAbilityInfo(props) {

        InfoClass.call(this, props);

        this.infoType = InfoType.computerAbilityInfo;
        this.items = [];

        if ( props && props.items ) {
            var newItems = [];
            for ( var i=0 ; i<props.items.length ; i++ ) {
                newItems.push(new ComputerAbilityInfoItem(props.items[i]));
            }

            this.items = newItems;
        }
    }

    Util.inherit(ComputerAbilityInfo, InfoClass);

    return ComputerAbilityInfo;
});
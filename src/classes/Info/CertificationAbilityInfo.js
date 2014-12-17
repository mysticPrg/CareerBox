/**
 * Created by careerBox on 2014-12-16.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Util',
    'classes/Info/InfoClass',
    'classes/Info/CertificationAbilityInfoItem',
    'classes/Enums/InfoType'
], function (Util, InfoClass, CertificationAbilityInfoItem, InfoType) {

    function CertificateAbilityInfo(props) {

        InfoClass.call(this, props);

        this.title = '자격증';
        this.infoType = InfoType.certificateAbilityInfo;
        this.items = [];

        if ( props && props.items ) {
            var newItems = [];
            for ( var i=0 ; i<props.items.length ; i++ ) {
                newItems.push(new CertificationAbilityInfoItem(props.items[i]));
            }

            this.items = newItems;
        }
    }

    Util.inherit(CertificateAbilityInfo, InfoClass);

    return CertificateAbilityInfo;
});
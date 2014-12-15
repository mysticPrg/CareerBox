/**
 * Created by careerBox on 2014-12-16.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Util',
    'classes/Info/InfoClass',
    'classes/Enums/InfoType'
], function (Util, InfoClass, InfoType) {

    function CertificateAbilityInfo(props) {

        InfoClass.call(this, props);

        this.infoType = InfoType.certificateAbilityInfo;

        this.S_name = '';
        this.S_publisher = '';         // 발행처
        this.D_date = new Date();
        this.I_image = '';
        this.F_file = '';

        if ( props ) {
            this.S_name = props.S_name ? props.S_name : this.S_name;
            this.S_publisher = props.S_publisher ? props.S_publisher : this.S_publisher;
            this.D_date = props.D_date ? props.D_date : this.D_date;
            this.I_image = props.I_image ? props.I_image : this.I_image;
            this.F_file = props.F_file ? props.F_file : this.F_file;
        }
    }

    Util.inherit(CertificateAbilityInfo, InfoClass);

    return CertificateAbilityInfo;
});
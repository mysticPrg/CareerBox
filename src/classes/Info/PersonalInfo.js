/**
 * Created by careerBox on 2014-12-15.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Util',
    'classes/Info/InfoClass',
    'classes/Enums/InfoType'
], function (Util, InfoClass, InfoType) {

    function PersonalInfo(props) {

        InfoClass.call(this, props);

        this.title = '기본정보';
        this.infoType = InfoType.personalInfo;

        this.I_picture = null;
        this.S_name_kr = '';
        this.S_name_en = '';
        this.S_name_ch = '';
        this.D_birthday = new Date();
        this.S_email = '';
        this.S_phone = '';
        this.S_cellphone = '';
        this.S_address_1 = '';
        this.S_address_2 = '';

        if ( props ) {
            this.I_picture = props.I_picture ? props.I_picture : this.I_picture;
            this.S_name_kr = props.S_name_kr ? props.S_name_kr : this.S_name_kr;
            this.S_name_en = props.S_name_en ? props.S_name_en : this.S_name_en;
            this.S_name_ch = props.S_name_ch ? props.S_name_ch : this.S_name_ch;
            this.D_birthday = props.D_birthday ? props.D_birthday : this.D_birthday;
            this.S_email = props.S_email ? props.S_email : this.S_email;
            this.S_phone = props.S_phone ? props.S_phone : this.S_phone;
            this.S_cellphone = props.S_cellphone ? props.S_cellphone : this.S_cellphone;
            this.S_address_1 = props.S_address_1 ? props.S_address_1 : this.S_address_1;
            this.S_address_2 = props.S_address_2 ? props.S_address_2 : this.S_address_2;
        }
    }

    Util.inherit(PersonalInfo, InfoClass);

    return PersonalInfo;
});
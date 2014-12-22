/**
 * Created by careerBox on 2014-12-17.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function () {

    var dictionary = {
        'I_picture' : '프로필',
        'S_name_kr' : '한글',
        'S_name_en' : '영문',
        'S_name_ch' : '한문',
        'D_birthday' : '생일',
        'S_email' : '이메일',
        'S_phone' : '전화번호',
        'S_cellphone' : '핸드폰',
        'S_address_1' : '주소',
        'S_address_2' : '상세주소'
    }

    function PersonalInfoItem(props) {

        this._id = null;
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

    PersonalInfoItem.prototype.getAttributeName = function getAttributeName(key) {
        return dictionary[key];
    }

    return PersonalInfoItem;
});
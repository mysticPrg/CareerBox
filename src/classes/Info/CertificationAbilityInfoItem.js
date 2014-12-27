/**
 * Created by careerBox on 2014-12-17.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function () {
    var dictionary = {
        'S_name': '자격증명',
        'S_publisher': '발행처',
        'D_date': '취급일자',
        'I_image': '대표이미지',
        'F_file': '첨부파일'
    };

    function CertificateAbilityInfoItem(props) {

        this._id = null;
        this.S_name = '';
        this.S_publisher = '';         // 발행처
        this.D_date = new Date();
        this.I_image = '';
        this.F_file = '';

        if (props) {
            this._id = props._id ? props._id : this._id;
            this.S_name = props.S_name ? props.S_name : this.S_name;
            this.S_publisher = props.S_publisher ? props.S_publisher : this.S_publisher;
            this.D_date = props.D_date ? props.D_date : this.D_date;
            this.I_image = props.I_image ? props.I_image : this.I_image;
            this.F_file = props.F_file ? props.F_file : this.F_file;
        }
    }

    CertificateAbilityInfoItem.prototype.getAttributeName = function getAttributeName(key) {
        return dictionary[key];
    };

    return CertificateAbilityInfoItem;
});
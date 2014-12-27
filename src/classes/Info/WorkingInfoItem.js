/**
 * Created by careerBox on 2014-12-17.
 */


if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Structs/Term'
], function (Term) {

    var dictionary = {
        'I_logo': '대표이미지',
        'S_name': '회사명',
        'S_address': '소재지',
        'S_hireType': '고용형태',
        'B_resignation': '퇴직여부',
        'T_term': '기간',
        'S_department': '부서',
        'S_position': '직위',
        'S_jobTitle': '직책',
        'S_jobType': '직종',
        'S_business': '주요업무',
        'S_achive': '주요성과'
    };

    function WorkingInfoItem(props) {

        this._id = null;
        this.I_logo = '';           // 대표이미지
        this.S_name = '';           // 회사명
        this.S_address = '';        // 소재지
        this.S_hireType = '';       // 고용 형태
        this.B_resignation = true; // 퇴직여부
        this.T_term = new Term();
        this.S_department = '';     // 부서
        this.S_position = '';       // 직위
        this.S_jobTitle = '';       // 직책
        this.S_jobType = '';        // 직종
        this.S_business = '';       // 주요 업무
        this.S_achive = '';         // 주요 성과

        if ( props ) {
            this._id = props._id ? props._id : this._id;
            this.I_logo = props.I_logo ? props.I_logo : this.I_logo;
            this.S_name = props.S_name ? props.S_name : this.S_name;
            this.S_address = props.S_address ? props.S_address : this.S_address;
            this.S_hireType = props.S_hireType ? props.S_hireType : this.S_hireType;
            this.B_resignation = (props.B_resignation!==undefined) ? props.B_resignation : this.B_resignation;
            this.T_term = props.T_term ? props.T_term : this.T_term;
            this.S_department = props.S_department ? props.S_department : this.S_department;
            this.S_position = props.S_position ? props.S_position : this.S_position;
            this.S_jobTitle = props.S_jobTitle ? props.S_jobTitle : this.S_jobTitle;
            this.S_jobType = props.S_jobType ? props.S_jobType : this.S_jobType;
            this.S_business = props.S_business ? props.S_business : this.S_business;
            this.S_achive = props.S_achive ? props.S_achive : this.S_achive;
        }
    }

    WorkingInfoItem.prototype.getAttributeName = function getAttributeName(key){
        return dictionary[key];
    };

    return WorkingInfoItem;
});
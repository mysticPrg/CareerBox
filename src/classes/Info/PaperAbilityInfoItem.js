/**
 * Created by careerBox on 2014-12-17.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Structs/Term'
], function () {

    var dictionary = {
        'S_title'   : '논문 제목',
        'S_academy' : '논문게재 학회',
        'D_date'    : '논문게재 날짜',
        'S_ratio'   : '참여 정도',
        'S_detail'  : '논문 내용'
    };

    function PaperAbilityInfoItem(props) {

        this._id = null;
        this.S_title = ''; // 논문 제목
        this.S_academy = ''; // 논문게재 학회
        this.D_date = new Date(); // 논문게재 날짜
        this.S_ratio = ''; // 참여 정도
        this.S_detail = ''; // 논문 내용

        if ( props ) {
            this._id = props._id ? props._id : this._id;
            this.S_title = props.S_title ? props.S_title : this.S_title;
            this.S_academy = props.S_academy ? props.S_academy : this.S_academy;
            this.D_date = props.D_date ? props.D_date : this.D_date;
            this.S_ratio = props.S_ratio ? props.S_ratio : this.S_ratio;
            this.S_detail = props.S_detail ? props.S_detail : this.S_detail;
        }
    }

    PaperAbilityInfoItem.prototype.getAttributeName = function getAttributeName(key){
        return dictionary[key];
    }

    return PaperAbilityInfoItem;
});
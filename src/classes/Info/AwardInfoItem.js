/**
 * Created by careerBox on 2014-12-17.
 */


if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function () {

    var dictionary = {
        'S_name'   : '대회명',
        'S_title' : '작품명',
        'S_host'    : '주최기관',
        'D_date'   : '수상일자',
        'L_detail'  : '상세정보'
    };

    function AwardInfoItem(props) {

        this.S_name = ''; // 대회명
        this.S_title = ''; // 작품명
        this.S_host = ''; // 주최기관
        this.D_date = new Date(); // 수상일자
        this.L_detail = ''; // 상세정보

        if ( props ) {
            this.S_name = props.S_name ? props.S_name : this.S_name;
            this.S_title = props.S_title ? props.S_title : this.S_title;
            this.S_host = props.S_host ? props.S_host : this.S_host;
            this.D_date = props.D_date ? props.D_date : this.D_date;
            this.L_detail = props.L_detail ? props.L_detail : this.L_detail;
        }

        AwardInfoItem.prototype.getAttributeName = function getAttributeName(key){
            return dictionary[key];
        }
    }

    return AwardInfoItem;
});
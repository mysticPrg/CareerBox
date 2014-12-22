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
        'S_country'   : '활동 국가',
        'T_term'    : '활동 기간',
        'S_description'   : '활동 내용',
        'I_image'  : '대표이미지',
        'F_file'  : '첨부파일'
    };

    function GlobalActivityInfoItem(props) {

        this._id = null;
        this.S_country = ''; // 활동 국가
        this.T_term = new Term(); // 활동 기간
        this.S_description = ''; // 활동 내용
        this.I_image = ''; // 대표이미지
        this.F_file = ''; // 첨부파일

        if ( props ) {
            this._id = props._id ? props._id : this._id;
            this.S_country = props.S_country ? props.S_country : this.S_country;
            this.T_term = props.T_term ? props.T_term : this.T_term;
            this.S_description = props.S_description ? props.S_description : this.S_description;
            this.I_image = props.I_image ? props.I_image : this.I_image;
            this.F_file = props.F_file ? props.F_file : this.F_file;
        }
    }

    GlobalActivityInfoItem.prototype.getAttributeName = function getAttributeName(key){
        return dictionary[key];
    }

    return GlobalActivityInfoItem;
});
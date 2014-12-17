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
        'S_category'   : '분류',
        'S_name' : '활동명',
        'T_term'    : '활동 기간',
        'L_description'   : '활동 내용',
        'I_image'  : '대표이미지',
        'F_file'  : '첨부파일'
    };

    function LocalActivityInfoItem(props) {

        this.S_category = ''; // 분류
        this.S_name = ''; // 활동명
        this.T_term = new Term(); // 활동 기간
        this.L_description = ''; // 활동 내용
        this.I_image = ''; // 대표이미지
        this.F_file = ''; // 첨부파일

        if ( props ) {
            this.S_category = props.S_category ? props.S_category : this.S_category;
            this.S_name = props.S_name ? props.S_name : this.S_name;
            this.T_term = props.T_term ? props.T_term : this.T_term;
            this.L_description = props.L_description ? props.L_description : this.L_description;
            this.I_image = props.I_image ? props.I_image : this.I_image;
            this.F_file = props.F_file ? props.F_file : this.F_file;
        }

        LocalActivityInfoItem.prototype.getAttributeName = function getAttributeName(key){
            return dictionary[key];
        }
    }

    return LocalActivityInfoItem;
});
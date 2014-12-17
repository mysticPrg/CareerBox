/**
 * Created by careerBox on 2014-12-17.
 */


if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Structs/Term'
], function (Term) {

    function GlobalActivityInfoItem(props) {

        this.S_country = ''; // 활동 국가
        this.T_term = new Term(); // 활동 기간
        this.L_description = ''; // 활동 내용
        this.I_image = ''; // 대표이미지
        this.F_file = ''; // 첨부파일

        if ( props ) {
            this.S_country = props.S_country ? props.S_country : this.S_country;
            this.T_term = props.T_term ? props.T_term : this.T_term;
            this.L_description = props.L_description ? props.L_description : this.L_description;
            this.I_image = props.I_image ? props.I_image : this.I_image;
            this.F_file = props.F_file ? props.F_file : this.F_file;
        }
    }

    return GlobalActivityInfoItem;
});
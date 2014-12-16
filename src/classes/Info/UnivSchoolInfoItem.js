/**
 * Created by careerBox on 2014-12-17.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Structs/Term'
], function (Term) {

    function UnivSchoolInfoItem(props) {

        this.S_name = '';              // 학교명
        this.S_address = '';           // 소재지
        this.B_graduate = false;      // 졸업 여부
        this.T_term = new Term();
        this.S_major = '';             // 전공

        if ( props ) {
            this.S_name = props.S_name ? props.S_name : this.S_name;
            this.S_address = props.S_address ? props.S_address : this.S_address;
            this.B_graduate = props.B_graduate ? props.B_graduate : this.B_graduate;
            this.T_term = props.T_term ? props.T_term : this.T_term;
            this.S_major = props.S_major ? props.S_major : this.S_major;
        }
    }

    return UnivSchoolInfoItem;
});
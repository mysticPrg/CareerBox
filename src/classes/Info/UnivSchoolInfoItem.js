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
        'S_name' : '학교명',            // 학교명
        'S_address' : '소재지',         // 소재지
        'B_graduate' : '졸업 여부',     // 졸업 여부
        'T_term' : '재학기간',
        'S_major' : '전공'             // 전공
    };

    function UnivSchoolInfoItem(props) {

        this._id = null;
        this.S_name = '';              // 학교명
        this.S_address = '';           // 소재지
        this.B_graduate = false;      // 졸업 여부
        this.T_term = new Term();
        this.S_major = '';             // 전공

        if ( props ) {
            this._id = props._id ? props._id : this._id;
            this.S_name = props.S_name ? props.S_name : this.S_name;
            this.S_address = props.S_address ? props.S_address : this.S_address;
            this.B_graduate = props.B_graduate ? props.B_graduate : this.B_graduate;
            this.T_term = props.T_term ? props.T_term : this.T_term;
            this.S_major = props.S_major ? props.S_major : this.S_major;
        }

        UnivSchoolInfoItem.prototype.getAttributeName = function getAttributeName(key){
            return dictionary[key];
        }
    }

    return UnivSchoolInfoItem;
});
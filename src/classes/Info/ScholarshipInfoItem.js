/**
 * Created by careerBox on 2014-12-17.
 */


if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function () {

    var dictionary = {
        'S_name' : '장학금명',
        'S_school' : '기관명',
        'N_year' : '수여년도',
        'N_term' : '수여학기'
    }

    function ScholarshipInfoItem(props) {

        this._id = null;
        this.S_name = ''; // 장학금명
        this.S_school = ''; // 학교명
        this.N_year = 0; // 수여 년도
        this.N_term = 0; // 수여 학기

        if ( props ) {
            this._id = props._id ? props._id : this._id;
            this.S_name = props.S_name ? props.S_name : this.S_name;
            this.S_school = props.S_school ? props.S_school : this.S_school;
            this.N_year = (props.N_year!==undefined) ? props.N_year : this.N_year;
            this.N_term = (props.N_term!==undefined) ? props.N_term : this.N_term;
        }
    }

    ScholarshipInfoItem.prototype.getAttributeName = function getAttributeName(key){
        return dictionary[key];
    }

    return ScholarshipInfoItem;
});
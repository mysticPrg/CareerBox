/**
 * Created by careerBox on 2014-12-17.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Structs/Term'
], function (Term) {

    function ComputerAbilityInfoItem(props) {

        this.S_name = '';              // 기능
        this.S_grade = '';             // 활용 수준
        this.T_term = new Term();     // 활용 기간

        if ( props ) {
            this.S_name = props.S_name ? props.S_name : this.S_name;
            this.S_grade = props.S_grade ? props.S_grade : this.S_grade;
            this.T_term = props.T_term ? props.T_term : this.T_term;
        }
    }

    return ComputerAbilityInfoItem;
});
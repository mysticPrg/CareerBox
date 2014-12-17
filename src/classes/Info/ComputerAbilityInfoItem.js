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
        'S_name' : '기능',
        'S_grade' : '활용수준',
        'N_term' : '활용기간'
    }

    function ComputerAbilityInfoItem(props) {

        this.S_name = '';              // 기능
        this.S_grade = '';             // 활용 수준
        this.N_term = 0;     // 활용 기간

        if ( props ) {
            this.S_name = props.S_name ? props.S_name : this.S_name;
            this.S_grade = props.S_grade ? props.S_grade : this.S_grade;
            this.N_term = props.N_term ? props.N_term : this.N_term;
        }

        ComputerAbilityInfoItem.prototype.getAttributeName = function getAttributeName(key){
            return dictionary[key];
        }
    }

    return ComputerAbilityInfoItem;
});
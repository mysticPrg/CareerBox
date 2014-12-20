/**
 * Created by careerBox on 2014-12-17.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function () {

    var dictionary = {
        'S_name' : '기능',
        'S_grade' : '활용수준',
        'N_term' : '활용기간'
    }

    function ComputerAbilityInfoItem(props) {

        this._id = null;
        this.S_name = '';              // 기능
        this.S_grade = '';             // 활용 수준
        this.N_term = 0;     // 활용 기간

        if ( props ) {
            this._id = props._id ? props._id : this._id;
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
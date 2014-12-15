/**
 * Created by careerBox on 2014-12-16.
 */


if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Util',
    'classes/Info/InfoClass',
    'classes/Enums/InfoType',
    'classes/Structs/Term'
], function (Util, InfoClass, InfoType, Term) {

    function HighSchoolInfo(props) {

        InfoClass.call(this, props);

        this.infoType = InfoType.personalInfo;

        this.S_name = '';              // 학교명
        this.B_qualification = false; // 검정고시 여부
        this.B_graduate = false;      // 졸업 여부
        this.T_term = new Term();
        this.S_major = '';             // 전공

        if ( props ) {
            this.S_name = props.S_name ? props.S_name : this.S_name;
            this.B_qualification = props.B_qualification ? props.B_qualification : this.B_qualification;
            this.B_graduate = props.B_graduate ? props.B_graduate : this.B_graduate;
            this.T_term = props.T_term ? props.T_term : this.T_term;
            this.S_major = props.S_major ? props.S_major : this.S_major;
        }
    }

    Util.inherit(HighSchoolInfo, InfoClass);

    return HighSchoolInfo;
});
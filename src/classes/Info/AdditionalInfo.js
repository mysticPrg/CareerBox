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

    var dictionary = {
        'B_veteran'                    : "보훈대상",
        'B_disability'                 : "장애여부",
        'T_militaryService_term'       : "복무기간",
        'S_militaryService_category'   : "병역사항",
        'S_religion'                   : "종교",
        'N_physical_tall'              : "신장",
        'N_physical_weight'            : "몸무게",
        'N_physical_blood'             : "혈액형",
        'N_physical_sight_left'        : "우시",
        'N_physical_sight_right'       : "좌시",
        'S_favorite'                   : "취미",
        'S_skill'                      : "특기",
        'S_respect'                    : "존경인물"
    }

    function AdditionalInfo(props) {

        InfoClass.call(this, props);

        this.title = '추가정보';
        this.infoType = InfoType.additionalInfo;

        this.B_veteran = false;
        this.B_disability = false;
        this.T_militaryService_term = new Term();
        this.S_militaryService_category = '';
        this.S_religion = '';
        this.N_physical_tall = 0;
        this.N_physical_weight = 0;
        this.N_physical_blood = 0;
        this.N_physical_sight_left = 0;
        this.N_physical_sight_right = 0;
        this.S_favorite = '';
        this.S_skill = '';
        this.S_respect = '';


        if ( props ) {
            this.B_veteran = props.B_veteran ? props.B_veteran : this.B_veteran;
            this.B_disability = props.B_disability ? props.B_disability : this.B_disability;
            this.T_militaryService_term = props.T_militaryService_term ? props.T_militaryService_term : this.T_militaryService_term;
            this.S_militaryService_category = props.S_militaryService_category ? props.S_militaryService_category : this.S_militaryService_category;
            this.S_religion = props.S_religion ? props.S_religion : this.S_religion;
            this.N_physical_tall = props.N_physical_tall ? props.N_physical_tall : this.N_physical_tall;
            this.N_physical_weight = props.N_physical_weight ? props.N_physical_weight : this.N_physical_weight;
            this.N_physical_blood = props.N_physical_blood ? props.N_physical_blood : this.N_physical_blood;
            this.N_physical_sight_left = props.N_physical_sight_left ? props.N_physical_sight_left : this.N_physical_sight_left;
            this.N_physical_sight_right = props.N_physical_sight_right ? props.N_physical_sight_right : this.N_physical_sight_right;
            this.S_favorite = props.S_favorite ? props.S_favorite : this.S_favorite;
            this.S_skill = props.S_skill ? props.S_skill : this.S_skill;
            this.S_respect = props.S_respect ? props.S_respect : this.S_respect;
        }

        AdditionalInfo.prototype.getAttributeName = function getAttributeName(key){
            return dictionary[key];
        }
    }

    Util.inherit(AdditionalInfo, InfoClass);

    return AdditionalInfo;
});
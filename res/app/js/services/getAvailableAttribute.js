/**
 * Created by KHW on 2014-12-17.
 */
define([
    'app',
    'classes/Enums/InfoType',
    'classes/Info/PersonalInfo',
    'classes/Info/AdditionalInfo',
    'classes/Info/HighSchoolInfoItem',
    'classes/Info/UnivSchoolInfoItem',
    'classes/Info/WorkingInfoItem',
    'classes/Info/CertificationAbilityInfoItem',
    'classes/Info/ComputerAbilityInfoItem',
    'classes/Info/ProficiencyInfoItem',
    'classes/Info/ScholarshipInfoItem',
    'classes/Info/AwardInfoItem',
    'classes/Info/LocalActivityInfoItem',
    'classes/Info/GlobalActivityInfoItem',
    'classes/Info/ProjectInfoItem',
    'classes/Info/ColumnInfoItem'
], function (app, InfoType, PersonalInfo, AdditionalInfo, HighSchoolInfoItem, UnivSchoolInfoItem, WorkingInfoItem, CertificationAbilityInfoItem, ComputerAbilityInfoItem,
             ProficiencyInfoItem, ScholarshipInfoItem, AwardInfoItem, LocalActivityInfoItem, GlobalActivityInfoItem, ProjectInfoItem, ColumnInfoItem) {
    app.factory('getAvailableAttribute', function () {
        return function (category, infoType) {
            var result = {};
            var item = getItem(category);

            for(var key in item){
                if(key.split('_')[0] === infoType){
                    var name = item.getAttributeName(key)
                    result[key] = name;
                }
            }

            return result;
        }

        function getItem(category){
            switch (category){
                case InfoType.personalInfo:
                    return new PersonalInfo();
                case InfoType.additionalInfo:
                    return new AdditionalInfo();
                case InfoType.highSchoolInfo:
                    return new HighSchoolInfoItem();
                case InfoType.univSchoolInfo:
                    return new UnivSchoolInfoItem();
                case InfoType.workingInfo:
                    return new WorkingInfoItem();
                case InfoType.certificationAbilityInfo:
                    return new CertificationAbilityInfoItem();
                case InfoType.computerAbilityInfo:
                    return new ComputerAbilityInfoItem();
                case InfoType.proficiencyInfo:
                    return new ProficiencyInfoItem();
                case InfoType.scholarshipInfo:
                    return new ScholarshipInfoItem();
                case InfoType.awardInfo:
                    return new AwardInfoItem();
                case InfoType.localActivityInfo:
                    return new LocalActivityInfoItem();
                case InfoType.globalActivityInfo:
                    return new GlobalActivityInfoItem();
                case InfoType.projectInfo:
                    return new ProjectInfoItem();
                case InfoType.columnInfo:
                    return new ColumnInfoItem();
            }
        }
    });
});

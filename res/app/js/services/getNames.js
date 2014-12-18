/**
 * Created by KHW on 2014-12-17.
 */
define([
    'app',
    'classes/Enums/InfoType',
    'classes/Info/PersonalInfo', // 개인정보
    'classes/Info/AdditionalInfo', // 추가정보
    'classes/Info/HighSchoolInfoItem', // 고등학교
    'classes/Info/UnivSchoolInfoItem', // 대학교
    'classes/Info/WorkingInfoItem', // 경력
    'classes/Info/CertificationAbilityInfoItem', // 자격증
    'classes/Info/ProficiencyInfoItem', // 외국어
    'classes/Info/ComputerAbilityInfoItem', // 컴퓨터 활용 능력
    'classes/Info/PaperAbilityInfoItem', // 논문
    'classes/Info/ScholarshipInfoItem', // 장학금
    'classes/Info/AwardInfoItem', // 수상내역
    'classes/Info/LocalActivityInfoItem', // 국내활동
    'classes/Info/GlobalActivityInfoItem', // 국외활동
    'classes/Info/ProjectInfoItem', // 프로젝트
    'classes/Info/ColumnInfoItem'  // 칼럼
], function (app, InfoType, PersonalInfo, AdditionalInfo, HighSchoolInfoItem, UnivSchoolInfoItem, WorkingInfoItem, CertificationAbilityInfoItem, ProficiencyInfoItem, ComputerAbilityInfoItem,
             PaperAbilityInfoItem, ScholarshipInfoItem, AwardInfoItem, LocalActivityInfoItem, GlobalActivityInfoItem, ProjectInfoItem, ColumnInfoItem) {
    app.factory('getNames', function () {
        return function (category) {
            var result = {};
            var item = getItem(category);

            for(var key in item){
                var AttributeName = item.getAttributeName(key);
                result[key] = {
                    'AttributeName' : AttributeName,
                    '' : ''
                };
            }

            return result;
        };

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
                case InfoType.proficiencyInfo:
                    return new ProficiencyInfoItem();
                case InfoType.computerAbilityInfo:
                    return new ComputerAbilityInfoItem();
                case InfoType.paperAbilityInfo:
                    return new PaperAbilityInfoItem();
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
        };
    });
});

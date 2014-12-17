/**
 * Created by KHW on 2014-12-17.
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Info/PersonalInfo',
    'classes/Info/AdditionalInfo',
    'classes/Info/HighSchoolInfo',
    'classes/Info/UnivSchoolInfo',
    'classes/Info/WorkingInfo',
    'classes/Info/CertificationAbilityInfo',
    'classes/Info/ProficiencyInfo',
    'classes/Info/ComputerAbilityInfo',
    'classes/Info/ScholarshipInfo',
    'classes/Info/PaperAbilityInfo',
    'classes/Info/AwardInfo',
    'classes/Info/LocalActivityInfo',
    'classes/Info/GlobalActivityInfo',
    'classes/Info/ProjectInfo',
    'classes/Info/ColumnInfo'
], function (PersonalInfo, AdditionalInfo, HighSchoolInfo, UnivSchoolInfo, WorkingInfo, CertificationAbilityInfo, ComputerAbilityInfo, ProficiencyInfo,
             PaperAbilityInfo, ScholarshipInfo, AwardInfo, LocalActivityInfo, GlobalActivityInfo, ProjectInfo, ColumnInfo) {
    var InfoCategory = [
        new PersonalInfo(), new AdditionalInfo(), new HighSchoolInfo(), new UnivSchoolInfo(), new WorkingInfo(), new CertificationAbilityInfo(), new ProficiencyInfo(),
        new ComputerAbilityInfo(),  new PaperAbilityInfo(), new ScholarshipInfo(), new AwardInfo(), new LocalActivityInfo(), new GlobalActivityInfo(),
        new ProjectInfo(), new ColumnInfo()
    ];

    return InfoCategory;
});
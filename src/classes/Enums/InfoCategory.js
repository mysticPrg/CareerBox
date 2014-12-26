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
    'classes/Info/PaperAbilityInfo',
    'classes/Info/ScholarshipInfo',
    'classes/Info/AwardInfo',
    'classes/Info/LocalActivityInfo',
    'classes/Info/GlobalActivityInfo',
    'classes/Info/ProjectInfo',
    'classes/Info/ColumnInfo'
], function (PersonalInfo, AdditionalInfo, HighSchoolInfo, UnivSchoolInfo, WorkingInfo, CertificationAbilityInfo, ProficiencyInfo, ComputerAbilityInfo,
             PaperAbilityInfo, ScholarshipInfo, AwardInfo, LocalActivityInfo, GlobalActivityInfo, ProjectInfo, ColumnInfo) {
    var InfoCategory = [
        new PersonalInfo(),
        new WorkingInfo(),
        new HighSchoolInfo(),
        new LocalActivityInfo(),
        new PaperAbilityInfo(),
        new UnivSchoolInfo(),
        new AwardInfo(),
        new ProficiencyInfo(),
        new CertificationAbilityInfo(),
        new ScholarshipInfo(),
        new AdditionalInfo(),
        new ColumnInfo(),
        new ComputerAbilityInfo(),
        new ProjectInfo(),
        new GlobalActivityInfo()
    ];

    return InfoCategory;
});
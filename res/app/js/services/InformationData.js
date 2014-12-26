/**
 * Created by JEONGBORAM-PC-W1 on 2014-12-16.
 */
define([
    'app',
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
], function (app, PersonalInfo, AdditionalInfo, HighSchoolInfo, UnivSchoolInfo, WorkingInfo, CertificationAbilityInfo, ProficiencyInfo, ComputerAbilityInfo, PaperAbilityInfo, ScholarshipInfo, AwardInfo, LocalActivityInfo, GlobalActivityInfo, ProjectInfo, ColumnInfo) {

    var InformationData = {
        workingInfo : new WorkingInfo(),
        highSchoolInfo : new HighSchoolInfo(),
        localActivityInfo : new LocalActivityInfo(),
        personalInfo : new PersonalInfo(),
        paperAbilityInfo : new PaperAbilityInfo(),
        univSchoolInfo : new UnivSchoolInfo(),
        awardInfo : new AwardInfo(),
        proficiencyInfo : new ProficiencyInfo(),
        certificateAbilityInfo : new CertificationAbilityInfo(),
        scholarshipInfo : new ScholarshipInfo(),
        additionalInfo : new AdditionalInfo(),
        columnInfo : new ColumnInfo(),
        computerAbilityInfo : new ComputerAbilityInfo(),
        projectInfo : new ProjectInfo(),
        globalActivityInfo : new GlobalActivityInfo()
    };

    app.factory('InformationData', function () {
        return InformationData;
    });

    return InformationData;
});


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
    'classes/Info/PaperAbilityInfo'
], function (app, PersonalInfo, AdditionalInfo, HighSchoolInfo, UnivSchoolInfo, WorkingInfo, CertificationAbilityInfo, ProficiencyInfo, ComputerAbilityInfo, PaperAbilityInfo) {

    var InformationData = {
        personalInfo : new PersonalInfo(),
        additionalInfo : new AdditionalInfo(),
        highSchoolInfo : new HighSchoolInfo(),
        univSchoolInfo : new UnivSchoolInfo(),
        workingInfo : new LocalActivityInfo(),
        certificateAbilityInfo : new CertificationAbilityInfo(),
        proficiencyInfo : new ProficiencyInfo(),
        computerAbilityInfo : new ComputerAbilityInfo(),
        paperAbilityInfo : new PaperAbilityInfo()
    };

    app.factory('InformationData', function () {
        return InformationData;
    });

    return InformationData;
});


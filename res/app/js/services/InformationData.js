/**
 * Created by JEONGBORAM-PC-W1 on 2014-12-16.
 */
define([
    'app',
    'classes/Info/PersonalInfo',
    'classes/Info/AdditionalInfo',
    'classes/Info/WorkingInfo'
], function (app, PersonalInfo, AdditionalInfo, WorkingInfo) {

    var InformationData = {
        personalInfo : new PersonalInfo(),
        additionalInfo : new AdditionalInfo(),
        highSchoolInfos : [],
        univSchoolInfos : [],
        workingInfos : [],
        certificateAbilityInfos : []
    };

    app.factory('InformationData', function () {
        return InformationData;
    });

    return InformationData;
});


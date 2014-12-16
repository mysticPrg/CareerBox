/**
 * Created by JEONGBORAM-PC-W1 on 2014-12-16.
 */
define([
    'app',
    'classes/Info/PersonalInfo',
    'classes/Info/AdditionalInfo',
    'classes/Info/HighSchoolInfo'
], function (app, PersonalInfo, AdditionalInfo, HighSchoolInfo) {

    var InformationData = {
        personalInfo : new PersonalInfo(),
        additionalInfo : new AdditionalInfo(),
        highSchoolInfo : new HighSchoolInfo()
    };

    app.factory('InformationData', function () {
        return InformationData;
    });

    return InformationData;
});


/**
 * Created by JEONGBORAM-PC-W1 on 2014-12-16.
 */
define([
    'app',
    'classes/Info/PersonalInfo',
    'classes/Info/AdditionalInfo'
], function (app, PersonalInfo, AdditionalInfo) {

    var InformationData = {
        personalInfo : new PersonalInfo(),
        additionalInfo : new AdditionalInfo()
    };

    app.factory('InformationData', function () {
        return InformationData;
    });

    return InformationData;
});


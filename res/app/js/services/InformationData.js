/**
 * Created by JEONGBORAM-PC-W1 on 2014-12-16.
 */
define([
    'app',
    'classes/Info/PersonalInfo'
], function (app, PersonalInfo) {

    var InformationData = {
        personalInfo : new PersonalInfo()
    };

    app.factory('InformationData', function () {
        return InformationData;
    });

    return InformationData;
});


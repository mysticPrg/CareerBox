/**
 * Created by mysticPrg on 2014-12-11.
 */

define([
    'app'
], function (app) {
    app.controller('proficiencyInformationContorller', function ($scope) {

    });

    app.directive('proficiencyInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/proficiencyInformation/template.html'),
            controller: 'proficiencyInformationContorller'
        };
    });
});
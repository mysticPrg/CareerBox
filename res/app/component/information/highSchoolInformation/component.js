/**
 * Created by mysticPrg on 2014-12-11.
 */

define([
    'app'
], function (app) {
    app.controller('highSchoolInformationContorller', function ($scope) {

    });

    app.directive('highSchoolInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/highSchoolInformation/template.html'),
            controller: 'highSchoolInformationContorller'
        };
    });
});
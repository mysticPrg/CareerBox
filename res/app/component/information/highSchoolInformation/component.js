/**
 * Created by mysticPrg on 2014-12-11.
 */

define([
    'app'
], function (app) {
    app.controller('highschoolInformationContorller', function ($scope) {

    });

    app.directive('highschoolInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/highschoolInformation/template.html'),
            controller: 'highschoolInformationContorller'
        };
    });
});
/**
 * Created by mysticPrg on 2014-12-11.
 */
define(['app'], function (app) {

    app.controller('scholarshipInformationController', function ($scope) {
    });

    app.directive('scholarshipInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/scholarshipInformation/template.html'),
            controller: 'scholarshipInformationController'
        };
    });

});
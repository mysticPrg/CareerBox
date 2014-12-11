/**
 * Created by mysticPrg on 2014-12-11.
 */
define(['app'], function (app) {

    app.controller('workingInformationController', function ($scope) {
    });

    app.directive('workingInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/workingInformation/template.html'),
            controller: 'workingInformationController'
        };
    });

});
/**
 * Created by mysticPrg on 2014-12-11.
 */
define(['app'], function (app) {

    app.controller('projectInformationController', function ($scope) {
    });

    app.directive('projectInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/projectInformation/template.html'),
            controller: 'projectInformationController'
        };
    });

});
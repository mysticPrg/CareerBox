/**
 * Created by mysticPrg on 2014-12-11.
 */
define(['app'], function (app) {

    app.controller('columnInformationController', function ($scope) {
    });

    app.directive('columnInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/columnInformation/template.html'),
            controller: 'columnInformationController'
        };
    });

});
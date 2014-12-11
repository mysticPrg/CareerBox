/**
 * Created by mysticPrg on 2014-12-11.
 */
define(['app'], function (app) {

    app.controller('awardInformationController', function ($scope) {
    });

    app.directive('awardInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/awardInformation/template.html'),
            controller: 'awardInformationController'
        };
    });

});
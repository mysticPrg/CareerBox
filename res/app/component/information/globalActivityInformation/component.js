/**
 * Created by mysticPrg on 2014-12-11.
 */
define(['app'], function (app) {

    app.controller('globalActivityInformationController', function ($scope) {
    });

    app.directive('globalActivityInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/globalActivityInformation/template.html'),
            controller: 'globalActivityInformationController'
        };
    });

});
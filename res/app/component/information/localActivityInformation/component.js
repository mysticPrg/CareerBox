/**
 * Created by mysticPrg on 2014-12-11.
 */
define(['app'], function (app) {

    app.controller('localActivityInformationController', function ($scope) {
    });

    app.directive('localActivityInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/localActivityInformation/template.html'),
            controller: 'localActivityInformationController'
        };
    });

});
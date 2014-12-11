/**
 * Created by mysticPrg on 2014-12-11.
 */
define(['app'], function (app) {

    app.controller('paperAbilityInformationController', function ($scope) {
    });

    app.directive('paperAbilityInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/paperAbilityInformation/template.html'),
            controller: 'paperAbilityInformation'
        };
    });

});
/**
 * Created by mysticPrg on 2014-12-11.
 */
define(['app'], function (app) {

    app.controller('computerAbilityInformationController', function ($scope) {
    });

    app.directive('computerAbilityInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/computerAbilityInformation/template.html'),
            controller: 'computerAbilityInformationController'
        };
    });

});
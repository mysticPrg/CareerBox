/**
 * Created by mysticPrg on 2014-12-11.
 */

define([
    'app'
], function (app) {
    app.controller('certificateAbilityInformationContorller', function ($scope) {

    });

    app.directive('certificateAbilityInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/certificateAbilityInformation/template.html'),
            controller: 'certificateAbilityInformationContorller'
        };
    });
});
/**
 * Created by mysticPrg on 2014-12-11.
 */

define([
    'app'
], function (app) {
    app.controller('additionalInformationContorller', function ($scope) {

    });

    app.directive('additionalInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/additionalInformation/template.html'),
            controller: 'additionalInformationContorller'
        };
    });
});
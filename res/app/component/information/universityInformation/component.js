/**
 * Created by mysticPrg on 2014-12-11.
 */

define([
    'app'
], function (app) {
    app.controller('universityInformationContorller', function ($scope) {

    });

    app.directive('universityInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/universityInformation/template.html'),
            controller: 'universityInformationContorller'
        };
    });
});
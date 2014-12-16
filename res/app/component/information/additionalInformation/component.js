/**
 * Created by mysticPrg on 2014-12-11.
 */

define([
    'app',
    'services/InformationData',
    'classes/Info/AdditionalInfo'
], function (app, InformationData, AdditionalInfo) {
    app.controller('additionalInformationContorller', function ($scope) {
        $scope.InformationData = InformationData;

        $scope.$watch("InformationData.additionalInfo", function () {
            $scope.additionalInfo = InformationData.additionalInfo;
        }, true);
    });

    app.directive('additionalInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/additionalInformation/template.html'),
            controller: 'additionalInformationContorller'
        };
    });
});
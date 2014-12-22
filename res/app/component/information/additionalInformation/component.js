/**
 * Created by mysticPrg on 2014-12-11.
 */

define([
    'app',
    'service/InformationData'
], function (app, InformationData) {
    app.controller('additionalInformationContorller', function ($scope) {
        $scope.InformationData = InformationData;

        $scope.$watch("InformationData.additionalInfo", function () {
            $scope.additionalInfo = InformationData.additionalInfo.items[0];
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
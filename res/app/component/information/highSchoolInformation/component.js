/**
 * Created by mysticPrg on 2014-12-11.
 */

define([
    'app',
    'services/InformationData'
], function (app, InformationData) {
    app.controller('highSchoolInformationContorller', function ($scope) {
        $scope.InformationData = InformationData;

        $scope.$watch("InformationData.highSchoolInfo", function () {
            $scope.highSchoolInfo = InformationData.highSchoolInfo;
        }, true);
//        $scope.highSchoolInfos = new Array();
    });

    app.directive('highSchoolInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/highSchoolInformation/template.html'),
            controller: 'highSchoolInformationContorller'
        };
    });
});
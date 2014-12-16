/**
 * Created by mysticPrg on 2014-12-11.
 */

define([
    'app',
    'services/InformationData',
    'classes/Info/HighSchoolInfo'
], function (app, InformationData, HighSchoolInfo) {
    app.controller('highSchoolInformationContorller', ['$scope', function ($scope) {
        $scope.highSchoolInfo = new HighSchoolInfo();

        $scope.InformationData = InformationData;

        $scope.$watch("InformationData.highSchoolInfos", function () {
            $scope.highSchoolInfos = InformationData.highSchoolInfos;
        }, true);

        $scope.add = function () {
            $scope.highSchoolInfo = new HighSchoolInfo();
            var newHighSchoolInfo = new HighSchoolInfo($scope.highSchoolInfo);
            $scope.highSchoolInfos.push(newHighSchoolInfo);
        }

        $scope.del = function (index) {
            $scope.highSchoolInfos.splice(index, 1);
        }

    }]);

    app.directive('highSchoolInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/highSchoolInformation/template.html'),
            controller: 'highSchoolInformationContorller'
        };
    });
});
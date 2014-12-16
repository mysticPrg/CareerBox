/**
 * Created by mysticPrg on 2014-12-11.
 */

define([
    'app',
    'services/InformationData',
    'classes/Info/HighSchoolInfoItem'
], function (app, InformationData, HighSchoolInfoItem) {
    app.controller('highSchoolInformationContorller', ['$scope', function ($scope) {
        $scope.highSchoolInfoItem = new HighSchoolInfoItem();

        $scope.InformationData = InformationData;

        $scope.$watch("InformationData.highSchoolInfo", function () {
            $scope.highSchoolInfoItems = InformationData.highSchoolInfo.items;
        }, true);

        $scope.addHighSchoolInfo = function () {
            var newHighSchoolInfoItem = new HighSchoolInfoItem($scope.highSchoolInfoItem);
            $scope.highSchoolInfoItems.push(newHighSchoolInfoItem);
            $scope.highSchoolInfoItem = new HighSchoolInfoItem();
        }

        $scope.delHighSchoolInfo = function (index) {
            $scope.highSchoolInfoItems.splice(index, 1);
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
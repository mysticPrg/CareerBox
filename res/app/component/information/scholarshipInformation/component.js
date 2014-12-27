/**
 * Created by mysticPrg on 2014-12-11.
 */
define([
    'app',
    'service/InformationData',
    'classes/Info/ScholarshipInfoItem'
], function (app,InformationData, ScholarshipInfoItem) {
    app.controller('scholarshipInformationController', ['$scope', function ($scope) {
        $scope.scholarshipInfoItem = new ScholarshipInfoItem();

        $scope.InformationData = InformationData;

        $scope.$watch("InformationData.scholarshipInfo", function () {
            $scope.scholarshipInfoItems = InformationData.scholarshipInfo.items;
        }, true);

        $scope.addScholarshipInfo = function () {
            var newScholarshipInfoItem = new ScholarshipInfoItem($scope.scholarshipInfoItem);
            $scope.scholarshipInfoItems.push(newScholarshipInfoItem);
            $scope.scholarshipInfoItem = new ScholarshipInfoItem();
        };

        $scope.delScholarshipInfo = function (index) {
            $scope.scholarshipInfoItems.splice(index, 1);
        };

    }]);

    app.directive('scholarshipInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/scholarshipInformation/template.html'),
            controller: 'scholarshipInformationController'
        };
    });

});
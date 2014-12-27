/**
 * Created by mysticPrg on 2014-12-11.
 */
define([
    'app',
    'service/InformationData',
    'classes/Info/WorkingInfoItem'
], function (app, InformationData, WorkingInfoItem) {

    app.controller('workingInformationController', ['$scope', function ($scope) {
        $scope.workingInfoItem = new WorkingInfoItem();

        $scope.InformationData = InformationData;

        $scope.$watch("InformationData.workingInfo", function () {
            $scope.workingInfoItems = InformationData.workingInfo.items;
        }, true);

        $scope.addWorkingInfo = function () {
            var newWorkingInfoItem = new WorkingInfoItem($scope.workingInfoItem);
            $scope.workingInfoItems.push(newWorkingInfoItem);
            $scope.workingInfoItem = new WorkingInfoItem();
        };

        $scope.delWorkingInfo = function (index) {
            $scope.workingInfoItems.splice(index, 1);
        };

    }]);

    app.directive('workingInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/workingInformation/template.html'),
            controller: 'workingInformationController'
        };
    });

});
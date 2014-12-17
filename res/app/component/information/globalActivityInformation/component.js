/**
 * Created by mysticPrg on 2014-12-11.
 */
define([
    'app',
    'services/InformationData',
    'classes/Info/GlobalActivityInfoItem'
], function (app, InformationData, GlobalActivityInfoItem) {
    app.controller('globalActivityInformationController', ['$scope', function ($scope) {
        $scope.globalActivityInfoItem = new GlobalActivityInfoItem();

        $scope.InformationData = InformationData;

        $scope.$watch("InformationData.globalActivityInfo", function () {
            $scope.globalActivityInfoItems = InformationData.globalActivityInfo.items;
        }, true);

        $scope.addGlobalActivityInfo = function () {
            var newGlobalActivityInfoItem = new GlobalActivityInfoItem($scope.globalActivityInfoItem);
            $scope.globalActivityInfoItems.push(newGlobalActivityInfoItem);
            $scope.globalActivityInfoItem = new GlobalActivityInfoItem();
        }

        $scope.delGlobalActivityInfo = function (index) {
            $scope.globalActivityInfoItems.splice(index, 1);
        }

    }]);

    app.directive('globalActivityInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/globalActivityInformation/template.html'),
            controller: 'globalActivityInformationController'
        };
    });

});
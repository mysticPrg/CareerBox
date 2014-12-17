/**
 * Created by mysticPrg on 2014-12-11.
 */
define([
    'app',
    'services/InformationData',
    'classes/Info/LocalActivityInfoItem'
], function (app, InformationData, LocalActivityInfoItem) {
    app.controller('localActivityInformationController', ['$scope', function ($scope) {
        $scope.localActivityInfoItem = new LocalActivityInfoItem();

        $scope.InformationData = InformationData;

        $scope.$watch("InformationData.localActivityInfo", function () {
            $scope.localActivityInfoItems = InformationData.localActivityInfo.items;
        }, true);

        $scope.addLocalActivityInfo = function () {
            var newLocalActivityInfoItem = new LocalActivityInfoItem($scope.localActivityInfoItem);
            $scope.localActivityInfoItems.push(newLocalActivityInfoItem);
            $scope.localActivityInfoItem = new LocalActivityInfoItem();
        }

        $scope.delLocalActivityInfo = function (index) {
            $scope.localActivityInfoItems.splice(index, 1);
        }

    }]);

    app.directive('localActivityInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/localActivityInformation/template.html'),
            controller: 'localActivityInformationController'
        };
    });

});
/**
 * Created by mysticPrg on 2014-12-11.
 */
define([
    'app',
    'services/InformationData',
    'classes/Info/ComputerAbilityInfoItem'
], function (app, InformationData, ComputerAbilityInfoItem) {
    app.controller('computerAbilityInformationController', ['$scope', function ($scope) {
        $scope.computerAbilityInfoItem = new ComputerAbilityInfoItem();

        $scope.InformationData = InformationData;

        $scope.$watch("InformationData.computerAbilityInfo", function () {
            $scope.computerAbilityInfoItems = InformationData.computerAbilityInfo.items;
        }, true);

        $scope.addComputerAbilityInfo = function () {
            var newComputerAbilityInfoItem = new ComputerAbilityInfoItem($scope.computerAbilityInfoItem);
            $scope.computerAbilityInfoItems.push(newComputerAbilityInfoItem);
            $scope.computerAbilityInfoItem = new ComputerAbilityInfoItem();
        }

        $scope.delComputerAbilityInfo = function (index) {
            $scope.computerAbilityInfoItems.splice(index, 1);
        }

    }]);

    app.directive('computerAbilityInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/computerAbilityInformation/template.html'),
            controller: 'computerAbilityInformationController'
        };
    });

});
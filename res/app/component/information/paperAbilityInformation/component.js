/**
 * Created by mysticPrg on 2014-12-11.
 */
define([
    'app',
    'service/InformationData',
    'classes/Info/PaperAbilityInfoItem'
], function (app, InformationData, PaperAbilityInfoItem) {
    app.controller('paperAbilityInformationController', ['$scope', function ($scope) {
        $scope.paperAbilityInfoItem = new PaperAbilityInfoItem();

        $scope.InformationData = InformationData;

        $scope.$watch("InformationData.paperAbilityInfo", function () {
            $scope.paperAbilityInfoItems = InformationData.paperAbilityInfo.items;
        }, true);

        $scope.addPaperAbilityInfo = function () {
            var newPaperAbilityInfoItem = new PaperAbilityInfoItem($scope.paperAbilityInfoItem);
            $scope.paperAbilityInfoItems.push(newPaperAbilityInfoItem);
            $scope.paperAbilityInfoItem = new PaperAbilityInfoItem();
        };

        $scope.delPaperAbilityInfo = function (index) {
            $scope.paperAbilityInfoItems.splice(index, 1);
        };

    }]);

    app.directive('paperAbilityInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/paperAbilityInformation/template.html'),
            controller: 'paperAbilityInformationController'
        };
    });

});
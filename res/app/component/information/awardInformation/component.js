/**
 * Created by mysticPrg on 2014-12-11.
 */
define([
    'app',
    'service/InformationData',
    'classes/Info/AwardInfoItem'
], function (app, InformationData, AwardInfoItem) {
    app.controller('awardInformationController', ['$scope', function ($scope) {
        $scope.awardInfoItem = new AwardInfoItem();

        $scope.InformationData = InformationData;

        $scope.$watch("InformationData.awardInfo", function () {
            $scope.awardInfoItems = InformationData.awardInfo.items;
        }, true);

        $scope.addAwardInfo = function () {
            var newAwardInfoItem = new AwardInfoItem($scope.awardInfoItem);
            $scope.awardInfoItems.push(newAwardInfoItem);
            $scope.awardInfoItem = new AwardInfoItem();
        };

        $scope.delAwardInfo = function (index) {
            $scope.awardInfoItems.splice(index, 1);
        };
    }]);

    app.directive('awardInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/awardInformation/template.html'),
            controller: 'awardInformationController'
        };
    });

});
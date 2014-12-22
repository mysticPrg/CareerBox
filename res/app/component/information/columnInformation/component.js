/**
 * Created by mysticPrg on 2014-12-11.
 */
define([
    'app',
    'service/InformationData',
    'classes/Info/ColumnInfoItem'
], function (app, InformationData, ColumnInfoItem) {
    app.controller('columnInformationController', ['$scope', function ($scope) {
        $scope.columnInfoItem = new ColumnInfoItem();

        $scope.InformationData = InformationData;

        $scope.$watch("InformationData.columnInfo", function () {
            $scope.columnInfoItems = InformationData.columnInfo.items;
        }, true);

        $scope.addColumnInfo = function () {
            var newColumnInfo = new ColumnInfoItem($scope.columnInfoItem);
            $scope.columnInfoItems.push(newColumnInfo);
            $scope.columnInfoItem = new ColumnInfoItem();
        }

        $scope.delColumnInfo = function (index) {
            $scope.columnInfoItems.splice(index, 1);
        }
    }]);

    app.directive('columnInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/columnInformation/template.html'),
            controller: 'columnInformationController'
        };
    });

});
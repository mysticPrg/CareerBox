/**
 * Created by mysticPrg on 2014-12-11.
 */

define([
    'app',
    'services/InformationData',
    'classes/Info/ProficiencyInfoItem'
], function (app, InformationData, ProficiencyInfoItem) {
    app.controller('proficiencyInformationContorller', ['$scope', function ($scope) {
        $scope.proficiencyInfoItem = new ProficiencyInfoItem();

        $scope.InformationData = InformationData;

        $scope.$watch("InformationData.proficiencyInfo", function () {
            $scope.proficiencyInfoItems = InformationData.proficiencyInfo.items;
        }, true);

        $scope.addProficiencyInfo = function () {
            var newProficiencyInfoItem = new ProficiencyInfoItem($scope.proficiencyInfoItem);
            $scope.proficiencyInfoItems.push(newProficiencyInfoItem);
            $scope.proficiencyInfoItem = new ProficiencyInfoItem();
        }

        $scope.delProficiencyInfo = function (index) {
            $scope.proficiencyInfoItems.splice(index, 1);
        }

    }]);

    app.directive('proficiencyInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/proficiencyInformation/template.html'),
            controller: 'proficiencyInformationContorller'
        };
    });
});
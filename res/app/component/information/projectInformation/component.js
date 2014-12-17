/**
 * Created by mysticPrg on 2014-12-11.
 */
define([
    'app',
    'services/InformationData',
    'classes/Info/ProjectInfoItem'
], function (app, InformationData, ProjectInfoItem) {
    app.controller('projectInformationController', ['$scope', function ($scope) {
        $scope.projectInfoItem = new ProjectInfoItem();

        $scope.InformationData = InformationData;

        $scope.$watch("InformationData.projectInfo", function () {
            $scope.projectInfoItems = InformationData.projectInfo.items;
        }, true);

        $scope.addProjectInfo = function () {
            var newProjectInfoItem = new ProjectInfoItem($scope.projectInfoItem);
            $scope.projectInfoItems.push(newProjectInfoItem);
            $scope.projectInfoItem = new ProjectInfoItem();
        }

        $scope.delProjectInfo = function (index) {
            $scope.projectInfoItems.splice(index, 1);
        }

    }]);

    app.directive('projectInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/projectInformation/template.html'),
            controller: 'projectInformationController'
        };
    });

});
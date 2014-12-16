/**
 * Created by mysticPrg on 2014-12-11.
 */
define([
    'app',
    'services/InformationData',
    'classes/Info/WorkingInfo'
], function (app, InformationData, WorkingInfo) {

    app.controller('workingInformationController', function ($scope) {
        $scope.workingInfo = new PaperAbilityInfo();

        $scope.InformationData = InformationData;

        $scope.$watch("InformationData.workingInfos", function () {
            $scope.workingInfos = InformationData.workingInfos;
        }, true);

        $scope.addWorking = function () {
            var newWorkingInfo = new PaperAbilityInfo($scope.workingInfo);
            $scope.workingInfos.push(newWorkingInfo);
            $scope.workingInfo = new PaperAbilityInfo();
        }

        $scope.delWorking = function (index) {
            $scope.workingInfos.splice(index, 1);
        }
    });

    app.directive('workingInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/workingInformation/template.html'),
            controller: 'workingInformationController'
        };
    });

});
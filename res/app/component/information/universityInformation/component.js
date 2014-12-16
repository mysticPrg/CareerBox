/**
 * Created by mysticPrg on 2014-12-11.
 */

define([
    'app',
    'services/InformationData',
    'classes/Info/UnivSchoolInfo'
], function (app, InformationData, UnivSchoolInfo) {
    app.controller('universityInformationContorller', ['$scope', function ($scope) {
        $scope.univSchoolInfo = new UnivSchoolInfo();

        $scope.InformationData = InformationData;

        $scope.$watch("InformationData.univSchoolInfos", function () {
            $scope.univSchoolInfos = InformationData.univSchoolInfos;
        }, true);

        $scope.addUnivSchool = function () {
            var newUnivSchoolInfo = new UnivSchoolInfo($scope.univSchoolInfo);
            $scope.univSchoolInfos.push(newUnivSchoolInfo);
            $scope.univSchoolInfo = new UnivSchoolInfo();
        }

        $scope.delUnivSchool = function (index) {
            $scope.univSchoolInfos.splice(index, 1);
        }

    }]);

    app.directive('universityInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/universityInformation/template.html'),
            controller: 'universityInformationContorller'
        };
    });
});
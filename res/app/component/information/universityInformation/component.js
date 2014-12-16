/**
 * Created by mysticPrg on 2014-12-11.
 */

define([
    'app',
    'services/InformationData',
    'classes/Info/UnivSchoolInfoItem'
], function (app, InformationData, UnivSchoolInfoItem) {
    app.controller('universityInformationContorller', ['$scope', function ($scope) {
        $scope.univSchoolInfoItem = new UnivSchoolInfoItem();

        $scope.InformationData = InformationData;

        $scope.$watch("InformationData.univSchoolInfo", function () {
            $scope.univSchoolInfoItems = InformationData.univSchoolInfo.items;
        }, true);

        $scope.addUnivSchoolInfo = function () {
            var newUnivSchoolInfoItem = new UnivSchoolInfoItem($scope.univSchoolInfoItem);
            $scope.univSchoolInfoItems.push(newUnivSchoolInfoItem);
            $scope.univSchoolInfoItem = new UnivSchoolInfoItem();
        }

        $scope.delUnivSchoolInfo = function (index) {
            $scope.univSchoolInfoItems.splice(index, 1);
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
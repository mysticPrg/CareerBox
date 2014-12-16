/**
 * Created by JEONGBORAM-PC-W1 on 2014-12-11.
 */
define([
    'app',
    'services/InformationData',
    'classes/Info/PersonalInfo'
], function (app, InformationData) {
    app.controller('personalInformationController', ['$scope',  function ($scope) {
        $scope.InformationData = InformationData;

        $scope.$watch("InformationData.personalInfo", function () {
            $scope.personalInfo = InformationData.personalInfo;
        }, true);

    }]);

    app.directive('personalInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/personalInformation/template.html'),
            controller: 'personalInformationController'
        };
    });

});
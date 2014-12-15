/**
 * Created by JEONGBORAM-PC-W1 on 2014-12-11.
 */
define([
    'app',
    'services/InformationData',
    'classes/Info/PersonalInfo'
], function (app, InformationData, PersonalInfo) {
    app.controller('personalInformationController', ['$scope', '$http', function ($scope, $http) {
        $scope.personalInfo = new PersonalInfo();
        InformationData.personalInfo = $scope.personalInfo;
    }]);

    app.directive('personalInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/personalInformation/template.html'),
            controller: 'personalInformationController'
        };
    });

});
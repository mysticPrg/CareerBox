/**
 * Created by mysticPrg on 2014-12-11.
 */

define([
    'app',
    'services/InformationData',
    'classes/Info/CertificationAbilityInfo'
], function (app, InformationData, CertificateAbilityInfo) {
    app.controller('certificateAbilityInformationContorller', ['$scope', function ($scope) {
        $scope.certificateAbilityInfo = new CertificateAbilityInfo();

        $scope.InformationData = InformationData;

        $scope.$watch("InformationData.certificateAbilityInfos", function () {
            $scope.certificateAbilityInfos = InformationData.certificateAbilityInfos;
        }, true);

        $scope.addCertificateAbility = function () {
            var newCertificateAbilityInfo = new CertificateAbilityInfo($scope.certificateAbilityInfo);
            $scope.certificateAbilityInfos.push(newCertificateAbilityInfo);
            $scope.certificateAbilityInfo = new CertificateAbilityInfo();
        }

        $scope.delCertificateAbility = function (index) {
            $scope.certificateAbilityInfos.splice(index, 1);
        }

    }]);

    app.directive('certificateAbilityInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/certificateAbilityInformation/template.html'),
            controller: 'certificateAbilityInformationContorller'
        };
    });
});
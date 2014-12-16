/**
 * Created by mysticPrg on 2014-12-11.
 */

define([
    'app',
    'services/InformationData',
    'classes/Info/CertificationAbilityInfoItem'
], function (app, InformationData, CertificationAbilityInfoItem) {
    app.controller('certificateAbilityInformationContorller', ['$scope', function ($scope) {
        $scope.certificateAbilityInfoItem = new CertificationAbilityInfoItem();

        $scope.InformationData = InformationData;

        $scope.$watch("InformationData.certificateAbilityInfo", function () {
            $scope.certificateAbilityInfoItems = InformationData.certificateAbilityInfo.items;
        }, true);

        $scope.addCertificateAbilityInfo = function () {
            var newCertificateAbilityInfoItem = new CertificationAbilityInfoItem($scope.certificateAbilityInfoItem);
            $scope.certificateAbilityInfoItems.push(newCertificateAbilityInfoItem);
            $scope.certificateAbilityInfoItem = new CertificationAbilityInfoItem();
        }

        $scope.delCertificateAbilityInfo = function (index) {
            $scope.certificateAbilityInfoItems.splice(index, 1);
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
/**
 * Created by mysticPrg on 2014-12-11.
 */

define([
    'app',
    'services/InformationData',
    'classes/Info/CertificationAbilityInfoItem',
    'angular-upload'
], function (app, InformationData, CertificationAbilityInfoItem) {
    app.controller('certificateAbilityInformationContorller', ['$scope', '$upload', function ($scope, $upload) {
        $scope.certificateAbilityInfoItem = new CertificationAbilityInfoItem();
        $scope.files;
        $scope.progress = 0;

        $scope.InformationData = InformationData;

        $scope.$watch("InformationData.certificateAbilityInfo", function () {
            $scope.certificateAbilityInfoItems = InformationData.certificateAbilityInfo.items;
        }, true);

        function initializeFileForm(){
            $scope.progress = 0;
            $('#certificate_file').val('');
            $('#certificate_upload').css('display', 'none');
            $('#certificate_progressbar').css('display', 'none');
        }

        $scope.addCertificateAbilityInfo = function () {
            var newCertificateAbilityInfoItem = new CertificationAbilityInfoItem($scope.certificateAbilityInfoItem);
            $scope.certificateAbilityInfoItems.push(newCertificateAbilityInfoItem);
            $scope.certificateAbilityInfoItem = new CertificationAbilityInfoItem();

            initializeFileForm();
        }

        $scope.delCertificateAbilityInfo = function (index) {
            $scope.certificateAbilityInfoItems.splice(index, 1);
        }

        $scope.onFileSelectCertificateAbilityInfo = function ($files) {
            $scope.files = $files;
            $('#certificate_upload').fadeIn('slow');
        }

        $scope.uploadCertificateAbilityInfo = function (){
            $('#certificate_progressbar').fadeIn('slow');

            for (var i = 0; i < $scope.files.length; i++) {
                var file = $scope.files[i];
                $scope.upload = $upload.upload({
                    url: 'http://210.118.74.166:8123/file',
                    method: 'POST',
                    withCredentials: true,
                    data: {isBinding: true},
                    file: file
                }).progress(function (evt) {
                    $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                }).success(function (data, status, headers, config) {
                    $scope.certificateAbilityInfoItem.F_file = data.result;
                });
            }
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
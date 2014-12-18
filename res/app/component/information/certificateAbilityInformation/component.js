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

        $scope.addCertificateAbilityInfo = function () {
            var newCertificateAbilityInfoItem = new CertificationAbilityInfoItem($scope.certificateAbilityInfoItem);
            $scope.certificateAbilityInfoItems.push(newCertificateAbilityInfoItem);
            $scope.certificateAbilityInfoItem = new CertificationAbilityInfoItem();

            initializeFileForm();
        }

        function initializeFileForm(){
            $('#progress-bar').css('display', 'none');
            $('#file').val('');
        }

        $scope.delCertificateAbilityInfo = function (index) {
            $scope.certificateAbilityInfoItems.splice(index, 1);
        }

        $scope.onFileSelect = function ($files) {
            $scope.files = $files;
            $('#btn-upload').fadeIn('slow');
        }

        $scope.upload = function (){
            $('#progress-bar').fadeIn('slow');

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

        function uploadDone(){
            $('#file-name').fadeIn('slow');
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
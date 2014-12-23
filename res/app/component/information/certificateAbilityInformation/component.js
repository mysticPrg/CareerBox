/**
 * Created by mysticPrg on 2014-12-11.
 */

define([
    'app',
    'service/InformationData',
    'classes/Info/CertificationAbilityInfoItem',
    'angular-upload',
    'service/fileUpload'
], function (app, InformationData, CertificationAbilityInfoItem) {
    app.controller('certificateAbilityInformationContorller', ['$scope', '$upload', 'fileUpload', function ($scope, $upload, fileUpload) {
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
            $scope.fileNameForCertification = '';

            initializeFileForm();
        }

        $scope.delCertificateAbilityInfo = function (index) {
            $scope.certificateAbilityInfoItems.splice(index, 1);
        }

        $scope.onFileSelectCertificateAbilityInfo = function ($files) {
            $scope.fileNameForCertification = $files[0].name;
            $scope.files = $files;
            $('#certificate_upload').fadeIn('slow');
        }

        $scope.uploadCertificateAbilityInfo = function (){
            $('#certificate_progressbar').fadeIn('slow');

            fileUpload($upload, $scope.files, true, function(evt){
                $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
            },function(data){
                $scope.certificateAbilityInfoItem.F_file = data.result;
            });
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
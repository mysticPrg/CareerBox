/**
 * Created by mysticPrg on 2014-12-11.
 */

define([
    'app',
    'services/InformationData',
    'classes/Info/ProficiencyInfoItem',
    'angular-upload'
], function (app, InformationData, ProficiencyInfoItem) {
    app.controller('proficiencyInformationContorller', ['$scope', '$upload', function ($scope, $upload) {
        $scope.proficiencyInfoItem = new ProficiencyInfoItem();
        $scope.files;
        $scope.progress = 0;

        $scope.InformationData = InformationData;

        $scope.$watch("InformationData.proficiencyInfo", function () {
            $scope.proficiencyInfoItems = InformationData.proficiencyInfo.items;
        }, true);

        function initializeFileForm(){
            $scope.progress = 0;
            $('#proficiency_file').val('');
            $('#proficiency_upload').css('display', 'none');
            $('#proficiency_progressbar').css('display', 'none');
        }

        $scope.addProficiencyInfo = function () {
            var newProficiencyInfoItem = new ProficiencyInfoItem($scope.proficiencyInfoItem);
            $scope.proficiencyInfoItems.push(newProficiencyInfoItem);
            $scope.proficiencyInfoItem = new ProficiencyInfoItem();
        }

        $scope.delProficiencyInfo = function (index) {
            $scope.proficiencyInfoItems.splice(index, 1);
        }

        $scope.onFileSelectProficiencyInfo = function ($files) {
            $scope.files = $files;
            $('#proficiency_upload').fadeIn('slow');
        }

        $scope.uploadProficiencyInfo = function (){
            $('#proficiency_progressbar').fadeIn('slow');

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
                    $scope.proficiencyInfoItem.F_file = data.result;
                });
            }
        }
    }]);

    app.directive('proficiencyInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/proficiencyInformation/template.html'),
            controller: 'proficiencyInformationContorller'
        };
    });
});
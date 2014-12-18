/**
 * Created by mysticPrg on 2014-12-11.
 */
define([
    'app',
    'services/InformationData',
    'classes/Info/ProjectInfoItem',
    'angular-upload'
], function (app, InformationData, ProjectInfoItem) {
    app.controller('projectInformationController', ['$scope', '$upload', function ($scope, $upload) {
        $scope.projectInfoItem = new ProjectInfoItem();
        $scope.files;
        $scope.progress = 0;

        $scope.InformationData = InformationData;

        $scope.$watch("InformationData.projectInfo", function () {
            $scope.projectInfoItems = InformationData.projectInfo.items;
        }, true);

        function initializeFileForm(){
            $scope.progress = 0;
            $('#project_file').val('');
            $('#project_upload').css('display', 'none');
            $('#project_progressbar').css('display', 'none');
        }

        $scope.addProjectInfo = function () {
            var newProjectInfoItem = new ProjectInfoItem($scope.projectInfoItem);
            $scope.projectInfoItems.push(newProjectInfoItem);
            $scope.projectInfoItem = new ProjectInfoItem();

            initializeFileForm();
        }

        $scope.delProjectInfo = function (index) {
            $scope.projectInfoItems.splice(index, 1);
        }

        $scope.onFileSelectProjectInfo = function ($files) {
            $scope.files = $files;
            $('#project_upload').fadeIn('slow');
        }

        $scope.uploadProjectInfo = function (){
            $('#project_progressbar').fadeIn('slow');

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
                    $scope.projectInfoItem.F_file = data.result;
                });
            }
        }

    }]);

    app.directive('projectInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/projectInformation/template.html'),
            controller: 'projectInformationController'
        };
    });

});
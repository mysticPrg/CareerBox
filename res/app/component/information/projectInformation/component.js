/**
 * Created by mysticPrg on 2014-12-11.
 */
define([
    'app',
    'service/InformationData',
    'classes/Info/ProjectInfoItem',
    'angular-upload',
    'service/fileUpload',
    'service/ImageUpload',
    'service/serverURL'
], function (app, InformationData, ProjectInfoItem) {
    app.controller('projectInformationController', ['$scope', '$upload', 'fileUpload', 'ImageUpload', 'serverURL',
        function ($scope, $upload, fileUpload, ImageUpload, serverURL) {
            $scope.projectInfoItem = new ProjectInfoItem();
            $scope.progress = 0;
            $scope.imageProgress = 0;
            $scope.serverURL = serverURL;

            $scope.InformationData = InformationData;

            $scope.$watch("InformationData.projectInfo", function () {
                $scope.projectInfoItems = InformationData.projectInfo.items;
            }, true);

            function initializeFileForm() {
                $scope.progress = 0;
                $scope.imageProgress = 0;

                $('#project_file').val('');
                $('#project_upload').css('display', 'none');
                $('#project_progressbar').css('display', 'none');

                $('#project_picture_upload').val('');
                $('#project_picture').attr('src', '../img/noImage200x200.png');
                $('#project_picture_progressbar').css('display', 'none');
            }

            $scope.addProjectInfo = function () {
                var newProjectInfoItem = new ProjectInfoItem($scope.projectInfoItem);
                $scope.projectInfoItems.push(newProjectInfoItem);
                $scope.projectInfoItem = new ProjectInfoItem();
                $scope.fileNameForProject = '';

                initializeFileForm();
            };

            $scope.delProjectInfo = function (index) {
                $scope.projectInfoItems.splice(index, 1);
            };

            $scope.onFileSelectProjectInfo = function ($files) {
                if($files[0].size > 5242880){
                    alert('파일 크기는 5MB를 넘을 수 없습니다.');
                    return;
                }

                $scope.fileNameForProject = $files[0].name;
                $scope.files = $files;
                $('#project_upload').fadeIn('slow');
            };

            $scope.uploadProjectInfo = function () {
                $('#project_progressbar').fadeIn('slow');

                fileUpload($upload, $scope.files, true, function (evt) {
                    $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                }, function (data) {
                    $scope.projectInfoItem.F_file = data.result;
                });
            };

            $scope.onFileSelectProjectImage = function ($files) {
                if($files[0].size > 5242880){
                    alert('파일 크기는 5MB를 넘을 수 없습니다.');
                    return;
                }

                $scope.fileName1 = $files[0].name;
                $scope.imageProgress = 0;
                $('#project_picture_progressbar').fadeIn('slow');

                ImageUpload($upload, $files, 'symbol', function (evt) {
                    $scope.imageProgress = parseInt(100.0 * evt.loaded / evt.total);
                }, function (data) {
                    $scope.projectInfoItem.I_image = data.result;
                    $('#project_picture').attr('src', serverURL + '/image/symbol/thumb/' + data.result._id);
                });
            };

        }]);

    app.directive('projectInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/projectInformation/template.html'),
            controller: 'projectInformationController'
        };
    });

});
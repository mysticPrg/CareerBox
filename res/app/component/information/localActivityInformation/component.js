/**
 * Created by mysticPrg on 2014-12-11.
 */
define([
    'app',
    'service/InformationData',
    'classes/Info/LocalActivityInfoItem',
    'angular-upload',
    'service/fileUpload',
    'service/ImageUpload'
], function (app, InformationData, LocalActivityInfoItem) {
    app.controller('localActivityInformationController', ['$scope', '$upload', 'fileUpload', 'ImageUpload',
        function ($scope, $upload, fileUpload, ImageUpload) {
            $scope.localActivityInfoItem = new LocalActivityInfoItem();
            $scope.progress = 0;
            $scope.imageProgress = 0;

            $scope.InformationData = InformationData;

            $scope.$watch("InformationData.localActivityInfo", function () {
                $scope.localActivityInfoItems = InformationData.localActivityInfo.items;
            }, true);

            function initializeFileForm() {
                $scope.progress = 0;
                $scope.imageProgress = 0;

                $('#localActivity_file').val('');
                $('#localActivity_upload').css('display', 'none');
                $('#localActivity_progressbar').css('display', 'none');

                $('#localActivity_picture_upload').val('');
                $('#localActivity_picture').attr('src', '../img/noImage200x200.png');
                $('#localActivity_picture_progressbar').css('display', 'none');
            }

            $scope.addLocalActivityInfo = function () {
                var newLocalActivityInfoItem = new LocalActivityInfoItem($scope.localActivityInfoItem);
                $scope.localActivityInfoItems.push(newLocalActivityInfoItem);
                $scope.localActivityInfoItem = new LocalActivityInfoItem();
                $scope.fileNameForLocalActivity = '';

                initializeFileForm();
            };

            $scope.delLocalActivityInfo = function (index) {
                $scope.localActivityInfoItems.splice(index, 1);
            };

            $scope.onFileSelectLocalActivityInfo = function ($files) {
                if($files[0].size > 5242880){
                    alert('파일 크기는 5MB를 넘을 수 없습니다.');
                    return;
                }

                $scope.fileNameForLocalActivity = $files[0].name;
                $scope.files = $files;
                $('#localActivity_upload').fadeIn('slow');
            };

            $scope.uploadLocalActivityInfo = function () {
                $('#localActivity_progressbar').fadeIn('slow');

                fileUpload($upload, $scope.files, true, function (evt) {
                    $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                }, function (data) {
                    $scope.localActivityInfoItem.F_file = data.result;
                });
            };

            $scope.onFileSelectLocalActivityImage = function ($files) {
                if($files[0].size > 5242880){
                    alert('파일 크기는 5MB를 넘을 수 없습니다.');
                    return;
                }

                $scope.fileName1 = $files[0].name;
                $scope.imageProgress = 0;
                $('#localActivity_picture_progressbar').fadeIn('slow');

                ImageUpload($upload, $files, 'symbol', function (evt) {
                    $scope.imageProgress = parseInt(100.0 * evt.loaded / evt.total);
                }, function (data) {
                    $scope.localActivityInfoItem.I_image = data.result;
                    $('#localActivity_picture').attr('src', 'http://210.118.74.166:8123/image/symbol/thumb/' + data.result._id);
                });
            };

        }]);

    app.directive('localActivityInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/localActivityInformation/template.html'),
            controller: 'localActivityInformationController'
        };
    });

});
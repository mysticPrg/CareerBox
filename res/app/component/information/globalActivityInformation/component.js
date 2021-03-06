/**
 * Created by mysticPrg on 2014-12-11.
 */
define([
    'app',
    'service/InformationData',
    'classes/Info/GlobalActivityInfoItem',
    'angular-upload',
    'service/fileUpload',
    'service/ImageUpload',
    'service/serverURL'
], function (app, InformationData, GlobalActivityInfoItem) {
    app.controller('globalActivityInformationController', ['$scope', '$upload', 'fileUpload', 'ImageUpload', 'serverURL',
        function ($scope, $upload, fileUpload, ImageUpload, serverURL) {
            $scope.globalActivityInfoItem = new GlobalActivityInfoItem();
            $scope.progress = 0;
            $scope.imageProgress = 0;
            $scope.serverURL = serverURL;

            $scope.InformationData = InformationData;

            $scope.$watch("InformationData.globalActivityInfo", function () {
                $scope.globalActivityInfoItems = InformationData.globalActivityInfo.items;
            }, true);

            function initializeFileForm() {
                $scope.progress = 0;
                $scope.imageProgress = 0;

                $('#globalActivity_file').val('');
                $('#globalActivity_upload').css('display', 'none');
                $('#globalActivity_progressbar').css('display', 'none');

                $('#globalActivity_picture_upload').val('');
                $('#globalActivity_picture').attr('src', '../img/noImage200x200.png');
                $('#globalActivity_picture_progressbar').css('display', 'none');
            }

            $scope.addGlobalActivityInfo = function () {
                var newGlobalActivityInfoItem = new GlobalActivityInfoItem($scope.globalActivityInfoItem);
                $scope.globalActivityInfoItems.push(newGlobalActivityInfoItem);
                $scope.globalActivityInfoItem = new GlobalActivityInfoItem();
                $scope.fileNameForGlobalActivity = '';

                initializeFileForm();
            };

            $scope.delGlobalActivityInfo = function (index) {
                $scope.globalActivityInfoItems.splice(index, 1);
            };

            $scope.onFileSelectGlobalActivityInfo = function ($files) {
                if ($files[0].size > 5242880) {
                    alert('파일 크기는 5MB를 넘을 수 없습니다.');
                    return;
                }

                $scope.fileNameForGlobalActivity = $files[0].name;
                $scope.files = $files;
                $('#globalActivity_upload').fadeIn('slow');
            };

            $scope.uploadGlobalActivityInfo = function () {
                $('#globalActivity_progressbar').fadeIn('slow');

                fileUpload($upload, $scope.files, true, function (evt) {
                    $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                }, function (data) {
                    $scope.globalActivityInfoItem.F_file = data.result;
                });
            };

            $scope.onFileSelectGlobalActivityImage = function ($files) {
                if($files[0].size > 5242880){
                    alert('파일 크기는 5MB를 넘을 수 없습니다.');
                    return;
                }

                $scope.fileName1 = $files[0].name;
                $scope.imageProgress = 0;
                $('#globalActivity_picture_progressbar').fadeIn('slow');

                ImageUpload($upload, $files, 'symbol', function (evt) {
                    $scope.imageProgress = parseInt(100.0 * evt.loaded / evt.total);
                }, function (data) {
                    $scope.globalActivityInfoItem.I_image = data.result;
                    $('#globalActivity_picture').attr('src', serverURL + '/image/symbol/thumb/' + data.result._id);
                });
            };

        }]);

    app.directive('globalActivityInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/globalActivityInformation/template.html'),
            controller: 'globalActivityInformationController'
        };
    });

});
/**
 * Created by JEONGBORAM-PC-W1 on 2014-11-16.
 */
define([
    'app',
    'classes/Paper',
    'services/ImageUpload',
    'services/deleteImage'
], function (app, Paper) {
    app.controller('bindingImageModal', function ($scope, $modalInstance, $compile, $upload, ImageUpload, $http, $q, deleteImage, $http) {
        $scope.files;
        $scope.progress = 0;

        $scope.imageFile;

        // 기존 파일 가져오기
        function getImageFiles() {
            var loadImagePromiss = $http.get('http://210.118.74.166:8123/image', {withCredentials: true});
            $q.all([loadImagePromiss]).then(function (resultArray) {
                $scope.imageFiles = resultArray[0].data.result;
            });
        }

        getImageFiles();

        $scope.selectImage = function (imageFile, e) {
            $scope.imageFile = imageFile;

            $('ul li div').removeClass('focus');
            $(e.target).parent().addClass('focus');
        }

        $scope.onFileSelectUnbindImage = function ($files) {
            $scope.files = $files;
        };

        $scope.uploadUnbindImage = function () {
            $('#image_picture_progressbar').fadeIn('slow');

            ImageUpload($upload, $scope.files, '', function (evt) {   // 독립이미지
                $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
            }, function (data) {
                // 파일 다시 받기
                getImageFiles();

                $scope.progress = 0;
                $('#image_picture_file').val('');
                $('#image_picture_progressbar').css('display', 'none');
            });
        }

        ///////////////////////////////

//        $scope.paper = new Paper();
        $scope.save = function () {
            $modalInstance.close($scope.imageFile); // 인자에 넘길 것을 넣는다.
        };
        $scope.cancel = function () {
            $modalInstance.dismiss();
        };

        $scope.deleteImage = function (id) {
            deleteImage({'_id': id}, function () {
                // 파일 다시 받기
                getImageFiles();
            });
        }
    });
    return {
        templateUrl: require.toUrl('component/bindingImageModal/template.html'),
        controller: 'bindingImageModal',
        size: 'lg'
    }
});
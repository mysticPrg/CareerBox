/**
 * Created by JEONGBORAM-PC-W1 on 2014-12-11.
 */
define([
    'app',
    'service/InformationData',
    'classes/Info/PersonalInfo',
    'angular-upload',
    'service/ImageUpload'
], function (app, InformationData) {
    app.controller('personalInformationController', ['$scope', '$upload', 'ImageUpload', function ($scope, $upload, ImageUpload) {
        $scope.InformationData = InformationData;
        $scope.progress = 0;


        $scope.$watch("InformationData.personalInfo", function () {
            $scope.personalInfo = InformationData.personalInfo;
        }, true);

        $scope.onFileSelectProfileImage = function ($files) {
            $scope.fileName = $files[0].name;
            $('#personal_picture_progressbar').fadeIn('slow');

            ImageUpload($upload, $files, 'profile', function (evt) {
                $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
            }, function (data) {
                $scope.personalInfo.I_picture = data.result;
                $('#personal_picture').attr('src', 'http://210.118.74.166:8123/image/profile/thumb/' + data.result._id);
            });
        }

    }]);

    app.directive('personalInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/personalInformation/template.html'),
            controller: 'personalInformationController'
        };
    });

});
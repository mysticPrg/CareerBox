/**
 * Created by JEONGBORAM-PC-W1 on 2014-12-11.
 */
define([
    'app',
    'services/InformationData',
    'classes/Info/PersonalInfo',
    'angular-upload',
    'services/profileImageUpload'
], function (app, InformationData) {
    app.controller('personalInformationController', ['$scope', '$upload', 'profileImageUpload', function ($scope, $upload, profileImageUpload) {
        $scope.InformationData = InformationData;
        $scope.progress = 0;

        $scope.$watch("InformationData.personalInfo", function () {
            $scope.personalInfo = InformationData.personalInfo;
        }, true);

        $scope.onFileSelectProfileImage = function ($files) {
            $('#personal_picture_progressbar').fadeIn('slow');

            profileImageUpload($upload, $files, function(evt){
                $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
            },function(data){
                $scope.personalInfo.I_picture = data.result;
                $('#personal_picture').attr('src', 'http://210.118.74.166:8123/image/profile/thumb/'+data.result._id);
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
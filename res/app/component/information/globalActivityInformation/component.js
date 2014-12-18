/**
 * Created by mysticPrg on 2014-12-11.
 */
define([
    'app',
    'services/InformationData',
    'classes/Info/GlobalActivityInfoItem',
    'angular-upload'
], function (app, InformationData, GlobalActivityInfoItem) {
    app.controller('globalActivityInformationController', ['$scope', '$upload', function ($scope, $upload) {
        $scope.globalActivityInfoItem = new GlobalActivityInfoItem();
        $scope.files;
        $scope.progress = 0;

        $scope.InformationData = InformationData;

        $scope.$watch("InformationData.globalActivityInfo", function () {
            $scope.globalActivityInfoItems = InformationData.globalActivityInfo.items;
        }, true);

        function initializeFileForm(){
            $scope.progress = 0;
            $('#globalActivity_file').val('');
            $('#globalActivity_upload').css('display', 'none');
            $('#globalActivity_progressbar').css('display', 'none');
        }

        $scope.addGlobalActivityInfo = function () {
            var newGlobalActivityInfoItem = new GlobalActivityInfoItem($scope.globalActivityInfoItem);
            $scope.globalActivityInfoItems.push(newGlobalActivityInfoItem);
            $scope.globalActivityInfoItem = new GlobalActivityInfoItem();

            initializeFileForm();
        }

        $scope.delGlobalActivityInfo = function (index) {
            $scope.globalActivityInfoItems.splice(index, 1);
        }

        $scope.onFileSelectGlobalActivityInfo = function ($files) {
            $scope.files = $files;
            $('#globalActivity_upload').fadeIn('slow');
        }

        $scope.uploadGlobalActivityInfo = function (){
            $('#globalActivity_progressbar').fadeIn('slow');

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
                    $scope.globalActivityInfoItem.F_file = data.result;
                });
            }
        }

    }]);

    app.directive('globalActivityInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/globalActivityInformation/template.html'),
            controller: 'globalActivityInformationController'
        };
    });

});
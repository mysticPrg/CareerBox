/**
 * Created by mysticPrg on 2014-12-11.
 */
define([
    'app',
    'services/InformationData',
    'classes/Info/LocalActivityInfoItem',
    'angular-upload'
], function (app, InformationData, LocalActivityInfoItem) {
    app.controller('localActivityInformationController', ['$scope', '$upload', function ($scope, $upload) {
        $scope.localActivityInfoItem = new LocalActivityInfoItem();
        $scope.files;
        $scope.progress = 0;

        $scope.InformationData = InformationData;

        $scope.$watch("InformationData.localActivityInfo", function () {
            $scope.localActivityInfoItems = InformationData.localActivityInfo.items;
        }, true);

        function initializeFileForm(){
            $scope.progress = 0;
            $('#localActivity_file').val('');
            $('#localActivity_upload').css('display', 'none');
            $('#localActivity_progressbar').css('display', 'none');
        }

        $scope.addLocalActivityInfo = function () {
            var newLocalActivityInfoItem = new LocalActivityInfoItem($scope.localActivityInfoItem);
            $scope.localActivityInfoItems.push(newLocalActivityInfoItem);
            $scope.localActivityInfoItem = new LocalActivityInfoItem();

            initializeFileForm();
        }

        $scope.delLocalActivityInfo = function (index) {
            $scope.localActivityInfoItems.splice(index, 1);
        }

        $scope.onFileSelectLocalActivityInfo = function ($files) {
            $scope.files = $files;
            $('#localActivity_upload').fadeIn('slow');
        }

        $scope.uploadLocalActivityInfo = function () {
            $('#localActivity_progressbar').fadeIn('slow');

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
                    $scope.localActivityInfoItem.F_file = data.result;
                });
            }
        }

    }]);

    app.directive('localActivityInformation', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/information/localActivityInformation/template.html'),
            controller: 'localActivityInformationController'
        };
    });

});
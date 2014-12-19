/**
 * Created by mysticPrg on 2014-12-11.
 */
define([
    'app',
    'services/InformationData',
    'classes/Info/GlobalActivityInfoItem',
    'angular-upload',
    'services/fileUpload'
], function (app, InformationData, GlobalActivityInfoItem) {
    app.controller('globalActivityInformationController', ['$scope', '$upload', 'fileUpload', function ($scope, $upload, fileUpload) {
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

            fileUpload($upload, $scope.files, true, function(evt){
                $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
            },function(data){
                $scope.globalActivityInfoItem.F_file = data.result;
            });
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
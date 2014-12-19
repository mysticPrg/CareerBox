/**
 * Created by mysticPrg on 2014-12-11.
 */
define([
    'app',
    'services/InformationData',
    'classes/Info/LocalActivityInfoItem',
    'angular-upload',
    'services/fileUpload'
], function (app, InformationData, LocalActivityInfoItem) {
    app.controller('localActivityInformationController', ['$scope', '$upload', 'fileUpload', function ($scope, $upload, fileUpload) {
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

            fileUpload($upload, $scope.files, true, function(evt){
                $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
            },function(data){
                $scope.localActivityInfoItem.F_file = data.result;
            });
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
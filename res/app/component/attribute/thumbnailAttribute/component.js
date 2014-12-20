
define([
    'app',
    'component/bindingImageModal/component'
], function (app, bindingImageModal) {

    app.directive('thumbnailAttribute', function () {
        return {
            restrict: 'A',
            scope: {
                data : "=to"
            },
            templateUrl: require.toUrl('component/attribute/thumbnailAttribute/template.html'),

            controller : function($scope, $modal){
                // 모달을 연다.
                $scope.openBindingImageModal = function() {
                    var modalInstance = $modal.open(bindingImageModal);
                    modalInstance.result.then(function (imageFile) {
                        // 성공
                        // 모델에 저장
                        $scope.data.thumbnail = imageFile._id;

                    }, function () {
                        // 실패
                    });

                }
            }
        };
    });

});
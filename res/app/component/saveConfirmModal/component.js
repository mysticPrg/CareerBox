
define([
    'app',
    'service/EditorData'
], function (app, EditorData) {
    app.controller('saveConfirmModalController', function ($scope, $modalInstance) {
        if(EditorData.editorType === 'template'){
            $scope.title = EditorData.template.title;
        }

        $scope.save = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    });

    return {
        templateUrl: require.toUrl('component/saveConfirmModal/template.html'),
        controller: 'saveConfirmModalController'
    };
});
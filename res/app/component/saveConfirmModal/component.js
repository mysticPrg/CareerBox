
define([
    'app',
    'services/EditorData'
], function (app, EditorData) {
    app.controller('saveConfirmModalController', function ($scope, $modalInstance) {
        $scope.title;

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
    }
});
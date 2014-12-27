
define([
    'app'
], function (app) {
    app.controller('deleteTemplateModalController', function ($scope, $modalInstance) {
        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    });

    return {
        templateUrl: require.toUrl('component/deleteTemplateModal/template.html'),
        controller: 'deleteTemplateModalController'
    };
});
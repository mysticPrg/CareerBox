
define([
    'app'
], function (app) {
    app.controller('deletePaperModalController', function ($scope, $modalInstance) {
        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    });

    return {
        templateUrl: require.toUrl('component/deletePaperModal/template.html'),
        controller: 'deletePaperModalController'
    }
});
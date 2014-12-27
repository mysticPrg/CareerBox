
define([
    'app'
], function (app) {

    app.controller('deletePortfolioModalController', function ($scope, $modalInstance) {
        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    });

    return {
        templateUrl: require.toUrl('component/deletePortfolioModal/template.html'),
        controller: 'deletePortfolioModalController'
    };
});
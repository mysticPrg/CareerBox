
define([
    'app',
    'classes/Templates/Template'
], function (app, Portfolio) {
    app.controller('createPortfolioModalController', function ($scope, $modalInstance) {
        $scope.portfolio = new Portfolio();
        $scope.ok = function () {
            $modalInstance.close($scope.portfolio);
        };
        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    });
    return {
        templateUrl: require.toUrl('component/createPortfolioModal/template.html'),
        controller: 'createPortfolioModalController'
    }
});
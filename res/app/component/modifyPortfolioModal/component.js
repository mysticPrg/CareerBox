
define([
    'app',
    '../../js/classes/Portfolio'
], function (app, Portfolio) {

    app.controller('modifyPortfolioModalController', function ($scope, $modalInstance) {
        $scope.portfolio = new Portfolio();
        $scope.ok = function () {
            $modalInstance.close($scope.portfolio);
        };
        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    });
    return {
        templateUrl: require.toUrl('component/modifyPortfolioModal/template.html'),
        controller: 'modifyPortfolioModalController'
    }
});
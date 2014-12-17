
define([
    'app',
    'classes/Portfolio',
    'services/EditorData'
], function (app, Portfolio, EditorData) {
    app.controller('modifyPortfolioModalController', function ($scope, $modalInstance) {
        $scope.portfolio = new Portfolio(EditorData.portfolio);
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
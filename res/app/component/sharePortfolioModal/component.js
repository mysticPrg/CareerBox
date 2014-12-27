
define([
    'app',
    'service/EditorData'
], function (app) {
    app.controller('sharePortfolioModalController', function ($scope, $window, $modalInstance, EditorData) {
        $scope.url = 'http://localhost:63342/CareerBoxService/res/app/partials/portfolio.html?id=' + EditorData.shareId;

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    });
    return {
        templateUrl: require.toUrl('component/sharePortfolioModal/template.html'),
        controller: 'sharePortfolioModalController'
    };
});
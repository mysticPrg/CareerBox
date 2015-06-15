
define([
    'app',
    'service/EditorData',
    'service/serverURL'
], function (app) {
    app.controller('sharePortfolioModalController', 'serverURL', function ($scope, $window, $modalInstance, EditorData, serverURL) {
        $scope.url = serverURL + '/res/app/partials/portfolio.html?id=' + EditorData.shareId;

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    });
    return {
        templateUrl: require.toUrl('component/sharePortfolioModal/template.html'),
        controller: 'sharePortfolioModalController'
    };
});
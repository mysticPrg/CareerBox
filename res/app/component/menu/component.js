define([
    'app',
    'component/tutorialModal/component',
    'service/httpLogout'
], function (app, tutorialModal) {
    app.controller('menuController', function ($scope, $window, $modal, httpLogout) {
        $scope.tutorial = function () {
            var modalInstance = $modal.open(tutorialModal);
            modalInstance.result.then(function () {
            }, function () {
            });
        };

        $scope.logout = function () {
            httpLogout(function (data) {
                if (data.returnCode === '000') {
                    $window.location.href = 'index.html';
                }
            });
        };
    });

    app.directive('menu', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/menu/template.html'),
            controller: 'menuController'
        };
    });

});
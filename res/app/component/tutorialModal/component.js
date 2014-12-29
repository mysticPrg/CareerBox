
define([
    'app'
], function (app) {
    app.controller('tutorialModalController', function ($scope, $modalInstance) {
        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    });
    return {
        templateUrl: require.toUrl('component/tutorialModal/template.html'),
        controller: 'tutorialModalController',
        size: 'lg'
    };
});

define([
    'app'
], function (app) {
    app.controller('tutorialModal', function ($scope, $modalInstance) {
        $scope.ok = function () {
            $modalInstance.close();
        };
    });

    return {
        templateUrl: require.toUrl('component/tutorialModal/template.html'),
        controller: 'tutorialModalController'
    };
});
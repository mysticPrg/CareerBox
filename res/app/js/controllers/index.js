/**
 * Created by careerBox on 2014-10-18.
 */

define([
    'jquery',
    'angular',
    'app',
    'component/tutorialModal/component',
    'component/menu/component'
], function ($, ng, app, tutorialModal) {
    app.controller('index', ['$scope', '$modal', function ($scope, $modal) {
        $scope.tutorial = function () {
            var modalInstance = $modal.open(tutorialModal);
            modalInstance.result.then(function () {
            }, function () {
            });
        };
    }]);
});
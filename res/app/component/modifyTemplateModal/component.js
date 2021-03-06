/**
 * Created by JEONGBORAM-PC-W1 on 2014-11-16.
 */
define([
    'app'
], function (app) {
    app.controller('createTemplateModalController', function ($scope, $modalInstance, template) {
        $scope.template = template;
        $scope.save = function () {
            $modalInstance.close($scope.template);
        };
        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    });
    return {
        templateUrl: require.toUrl('component/createTemplateModal/template.html'),
        controller: 'createTemplateModalController'
    };
});
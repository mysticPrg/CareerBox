/**
 * Created by JEONGBORAM-PC-W1 on 2014-11-16.
 */
define([
    'app',
    '../../js/classes/Paper'
], function (app, Paper) {
    app.controller('createPaperModalController', function ($scope, $modalInstance) {
        $scope.paper = new Paper();
        $scope.save = function () {
            $modalInstance.close($scope.paper);
        };
        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    });
    return {
        templateUrl: require.toUrl('component/createPaperModal/template.html'),
        controller: 'createPaperModalController'
    }
});
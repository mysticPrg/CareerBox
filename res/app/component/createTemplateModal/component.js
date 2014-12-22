/**
 * Created by JEONGBORAM-PC-W1 on 2014-11-16.
 */
define([
    'app',
    'classes/Templates/Template',
    'service/InformationData'
], function (app, Template) {
    app.controller('createTemplateModalController', function ($scope, $modalInstance, InformationData) {
        $scope.template = new Template();
        $scope.infoCategory = InformationData;
        $scope.category='';

        $scope.save = function () {
//            $scope.template.target.infoType = $scope.category.infoType;
//            $modalInstance.close($scope.template);
            console.log($scope.category);
        };
        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    });
    return {
        templateUrl: require.toUrl('component/createTemplateModal/template.html'),
        controller: 'createTemplateModalController'
    }
});
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

        $scope.save = function (category) {
            if(category){
                $scope.template.target.bindingType = {
                    infoType : category.infoType,
                    title : category.title
                }

                $scope.template.target.isBinding = true;

                $modalInstance.close($scope.template);
            } else {
                alert('카테고리를 선택해주세요.');
            }

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
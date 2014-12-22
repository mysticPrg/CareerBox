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
//        $scope.category='';

        $scope.save = function (category) {
            if(category){
                $scope.template.target.bindingType = {
                    infoType : category.infoType,
                    title : category.title
                }

                $scope.template.target.isBinding = true;

//                console.log('$scope.template', $scope.template);

//            $scope.template.target.bindingType = category;
            }

            $modalInstance.close($scope.template);
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
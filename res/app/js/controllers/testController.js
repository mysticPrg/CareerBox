/**
 * Created by KHW on 2014-12-17.
 */
define([
    'jquery',
    'angular',
    'app',
    'classes/Enums/InfoCategory',
    'services/getAvailableAttribute'
], function ($, ng, app, InfoCategory) {
    app.controller('testController', ['$scope', 'getAvailableAttribute', function ($scope, getAvailableAttribute) {
        $scope.infoCategory = InfoCategory;
        $scope.category = '';

        $scope.types = ['string', 'number', 'boolean', 'file', 'image', 'term', 'date'];
        $scope.type;

        $scope.result;

        $scope.test = function (){
            var category = $scope.category.infoType;

            var infoType = '';
            if($scope.type === $scope.types[0]){
                infoType = 'S';
            }else if($scope.type === $scope.types[1]){
                infoType = 'N';
            }else if($scope.type === $scope.types[2]){
                infoType = 'B';
            }else if($scope.type === $scope.types[3]){
                infoType = 'F';
            }else if($scope.type === $scope.types[4]){
                infoType = 'I';
            }else if($scope.type === $scope.types[5]){
                infoType = 'T';
            }else if($scope.type === $scope.types[6]){
                infoType = 'D';
            }

            $scope.result = getAvailableAttribute(category, infoType);
        }
    }]);
});

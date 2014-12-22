/**
 * Created by KHW on 2014-12-17.
 */
define([
    'jquery',
    'angular',
    'app',
    'classes/Enums/InfoCategory',
    'service/getAvailableAttribute'
], function ($, ng, app, InfoCategory) {
    app.controller('testController', ['$scope', 'getAvailableAttribute', function ($scope, getAvailableAttribute) {
        $scope.infoCategory = InfoCategory;
        $scope.category = '';

        $scope.myData = [{name: "Moroni", age: 50},
            {name: "Teancum", age: 43},
            {name: "Jacob", age: 27},
            {name: "Nephi", age: 29},
            {name: "Enos", age: 34}];
        $scope.myOptions = { data: 'myData' };

//        $scope.types = ['string', 'number', 'boolean', 'file', 'image', 'term', 'date'];
        $scope.types = {
            'string' : 'S',
            'number' : 'N',
            'boolean' : 'B',
            'file' : 'F',
            'image' : 'I',
            'term' : 'T',
            'date' : 'D'
        };

        $scope.type;

        $scope.result;

        $scope.test = function (){
            var category = $scope.category.infoType;

            var infoType = $scope.type;

            $scope.result = getAvailableAttribute(category, infoType);
        }
    }]);
});

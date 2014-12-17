/**
 * Created by KHW on 2014-12-17.
 */
define([
    'jquery',
    'angular',
    'app',
    'classes/Enums/InfoCategory'
], function ($, ng, app, InfoCategory) {
    app.controller('testController', ['$scope', '$http', function ($scope, $http) {
        $scope.infoCategory = InfoCategory;
    }]);
});

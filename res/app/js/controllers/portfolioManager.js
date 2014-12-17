/**
 * Created by JEONGBORAM-PC-W1 on 2014-11-06.
 */
define([
    'jquery',
    'angular',
    'app',
    '../../component/menu/component',
    '../../component/newPortfolio/component',
    'services/EditorData',
    'classes/Info/PersonalInfo'
], function ($, ng, app, EditorData, PersonalInfo) {
    app.controller('portfolioManager', ['$scope', '$http', '$window', function ($scope, $http, $window) {
        $scope.userInfo = '';

        $scope.initialize = function (){
            $http.get('http://210.118.74.166:8123/info/personal', {withCredentials: true}).
                success(function(data, status, headers, config) {
                    $scope.userInfo = data.result;
                });
        }

        $scope.editPersonalInformation = function(){
            $window.location.href = 'InformationManager.html';
        }
    }]);
});

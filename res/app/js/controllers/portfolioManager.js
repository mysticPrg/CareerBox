/**
 * Created by JEONGBORAM-PC-W1 on 2014-11-06.
 */
define([
    'jquery',
    'angular',
    'app',
    '../../component/menu/component',
    '../../component/newPortfolio/component'
    //'service/EditorData',
    //'classes/Info/PersonalInfo'
], function ($, ng, app) {
    app.controller('portfolioManager', ['$scope', '$http', '$window', function ($scope, $http, $window) {
        $scope.initialize = function (){
            $http.get('http://210.118.74.166:8123/info/mainInfo', {withCredentials: true}).
                success(function(data) {
                    var name = data.result._member_name.split('@')[0];
                    data.result._member_name = name;
                    $scope.userInfo = data.result;

                    $('#header-title').fadeIn('slow');


                });
        };

        $scope.editPersonalInformation = function(){
            $window.location.href = 'InformationManager.html';
        };
    }]);
});

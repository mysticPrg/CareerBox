/**
 * Created by JEONGBORAM-PC-W1 on 2014-11-06.
 */
define([
    'jquery',
    'angular',
    'app',
    '../../component/menu/component',
    '../../component/newPortfolio/component',
    'service/EditorData',
    'classes/Info/PersonalInfo'
], function ($, ng, app, EditorData, PersonalInfo) {
    app.controller('portfolioManager', ['$scope', '$http', '$window', function ($scope, $http, $window) {
        $scope.initialize = function (){
            $http.get('http://210.118.74.166:8123/info/personal', {withCredentials: true}).
                success(function(data, status, headers, config) {
                    $scope.userInfo = data.result;

                    if(data.result.S_name_kr === '' || data.result.S_name_kr === undefined){
                        $scope.userInfo.S_name_kr = data.result._member_email.split('@')[0];
                    }

                    $('#header-title').fadeIn('slow');


                });
        }

        $scope.editPersonalInformation = function(){
            $window.location.href = 'InformationManager.html';
        }
    }]);
});

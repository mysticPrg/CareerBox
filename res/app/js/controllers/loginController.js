/**
 * Created by gimbyeongjin on 14. 10. 23..
 */

define([
    'jquery',
    'angular',
    'app',
    'service/httpLogin',
    'service/memberCallback'
], function ($, ng, app) {
    app.controller('loginController', ['$scope', '$timeout', '$window', 'httpLogin', 'memberCallback', 'Facebook', function ($scope, $timeout, $window, httpLogin, memberCallback, Facebook) {

        $scope.errors = [];
        $scope.msgs = [];

        $scope.user = {};

        $scope.logged = false;

        $scope.$watch(
            function () {
                return Facebook.isReady();
            },
            function (newVal) {
                if (newVal)
                    $scope.facebookReady = true;
            }
        );

        $scope.IntentLogin = function () {
            Facebook.getLoginStatus(function (response) {
                if (response.status == 'connected') {
                    $scope.logged = true;
                    $scope.LoginFBSuccess();
                }else{
                    $scope.Facebooklogin();
                }
            });


        };

        $scope.Facebooklogin = function () {
            Facebook.login(function (response) {
                if (response.status == 'connected') {
                    $scope.logged = true;
                    $scope.LoginFBSuccess();
                }

            },{scope: 'email'});
        };

        $scope.loginCallback = function (data){
            console.log(data);

            var href = "portfolioManager.html";

            memberCallback($window, $scope, data, href);
        }

        $scope.LoginFBSuccess = function () {
            Facebook.api('/me', function (response) {
                $scope.$apply(function () {
                    console.log(response);
                    $scope.user = response;
                    httpLogin($scope.user.email, '', true, $scope.loginCallback);
                });

            });
        };

        $scope.login = function () {
            $scope.errors.splice(0, $scope.errors.length); // remove all error messages
            $scope.msgs.splice(0, $scope.msgs.length);

            httpLogin($scope.userEmail, $scope.userPassword, false, $scope.loginCallback);
        };
    }]);
});
/**
 * Created by gimbyeongjin on 14. 10. 24..
 */
define([
    'jquery',
    'angular',
    'app',
    'services/httpJoin',
    'services/memberCallback'
], function ($, ng, app) {
    app.controller('joinController', ['$scope', '$window', 'httpJoin', 'memberCallback', function ($scope, $window, httpJoin, memberCallback) {
        $scope.errors = [];
        $scope.msgs = [];

        $scope.redirectJoinForm = function (){
            window.location.href = "JoinForm.html";
        }

        $scope.join = function () {
            // 패스워드 확인
            if ($scope.userPassword != $scope.userPasswordReconfirm) {
                $scope.msgs.push("패스워드를 다시 확인해주세요.");
                return;
            }

            $scope.errors.splice(0, $scope.errors.length); // remove all error messages
            $scope.msgs.splice(0, $scope.msgs.length);

            httpJoin($scope.userEmail, $scope.userPassword, $scope.callback);

        };

        $scope.callback = function (data) {
            var href = "portfolioManage.html";
            memberCallback($window, $scope, data, href);
        };

        // 포트폴리오 에디터 이동 함수
        $scope.goToLogin = function (index) {
            var href = 'login.html';
            $window.location.href = href;
        }
    }])
});
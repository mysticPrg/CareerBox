define([
    'app',
    'service/EditorData',
    '../createPortfolioModal/component',
    '../modifyPortfolioModal/component',
    '../deletePortfolioModal/component',
    '../sharePortfolioModal/component',
    'service/getPortfolioList',
    'service/createPortfolio',
    'service/CommonCallback',
    'service/deletePortfolio',
    'service/modifyPortfolio',
    'service/serverURL'
], function (app, EditorData, createPortfolioModal, modifyPortfolioModal, deletePortfolioModal, sharePortfolioModal) {

    app.controller('newPortfolioController', ['$scope', '$http', '$window', '$modal', 'getPortfolioList', 'createPortfolio', 'deletePortfolio', 'CommonCallback', 'modifyPortfolio', 'serverURL',
        function ($scope, $http, $window, $modal, getPortfolioList, createPortfolio, deletePortfolio, CommonCallback, modifyPortfolio, serverURL) {

            $scope.serverURL = serverURL;

            // 포트폴리오 목록 변수
            $scope.portfolios = [];

            // 포트폴리오 리스트 가져오기 함수
            $scope.getPortfolioList = function () {
                getPortfolioList($http, function (data) {
                    CommonCallback(data, function () {
                        // 포트폴리오 리스트에 추가
                        for (var i = 0; i < data.result.length; i++) {
                            $scope.portfolios.push(data.result[i]); // 포트폴리오 리스트에 추가
                        }
                    });
                });
            };

            $scope.getPortfolioList();    // 함수 실행

            // 포트폴리오 생성 함수
            $scope.createPortfolio = function () {
                var modalInstance = $modal.open(createPortfolioModal);
                modalInstance.result.then(function (portfolio) { // OK
                    // 포트폴리오 생성 통신
                    createPortfolio($http, {portfolio: portfolio}, function (data) {
                        CommonCallback(data, function () { // 성공시
                            console.log("정상적으로 추가 되었습니다.");
                            // 생성한 객체의 아이디 부여
                            portfolio._id = data.result;
                            // 배열에 추가
                            $scope.portfolios.push(portfolio);
                        });
                    });
                }, function () { // Cancel
                });
            };

            // 포트폴리오 정보 변경 함수
            $scope.modifyPortfolio = function (index) {
                EditorData.portfolio = $scope.portfolios[index];

                var modalInstance = $modal.open(modifyPortfolioModal);
                modalInstance.result.then(function (portfolio) {
                    // OK
                    // 정보 변경
                    $scope.portfolios[index].title = portfolio.title;
                    $scope.portfolios[index].description = portfolio.description;
                    // 포트폴리오 변경 통신
                    modifyPortfolio($http, {portfolio: $scope.portfolios[index]}, function (data) {
                        CommonCallback(data, function () {
                            // 성공시
                            console.log("정상적으로 변경 되었습니다.");
                        });
                    });
                }, function () {
                    // Cancel
                });

            };

            // 포트폴리오 삭제 함수
            $scope.deletePortfolio = function (index) {
                var modalInstance = $modal.open(deletePortfolioModal);
                modalInstance.result.then(function () { // OK
                    // 포트폴리오 삭제 통신
                    deletePortfolio($http, {_id: $scope.portfolios[index]._id}, function (data) {
                        CommonCallback(data, function () { // 성공시
                            console.log("정상적으로 삭제 되었습니다.");
                        });
                    });

                    // 포트폴리오 삭제
                    $scope.portfolios.splice(index, 1);
                }, function () { // Cancel
                });
            };

            // 포트폴리오 정보 변경 함수
            $scope.sharePortfolio = function (id) {
                EditorData.shareId = id;

                $modal.open(sharePortfolioModal);
            };

            // 포트폴리오 에디터 이동 함수
            $scope.goToPortfolioEditor = function (portfolioId) {
                var href = 'portfolioEditor.html?id=' + portfolioId;
                $window.location.href = href;
            };

            $scope.goToPortfolio = function (portfolioId) {
                var href = 'portfolioPreview.html?id=' + portfolioId;
                //$window.location.href = href;
                window.open(href, '_blank').focus();
            };

        }]);

    app.directive('newPortfolio', function () {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/newPortfolio/template.html'),
            controller: 'newPortfolioController'
        };
    });

});

define([
    'app',
    'service/loadArticle',
    'service/LoadPaper',
    'service/EditorData',
    'service/SavePaper'
], function (app) {

    app.directive('rowcolAttribute', function (loadArticle, LoadPaper, EditorData, $http, SavePaper) {
        return {
            restrict: 'A',
            scope: {
                data : "=to"
            },
            templateUrl: require.toUrl('component/attribute/rowcolAttribute/template.html'),
            link : function($scope, element, att) {
                $scope.reload = function() {
                    //페이퍼 저장
                    var data = {_portfolio_id: EditorData.portfolio._id, paper: EditorData.paper};
                    SavePaper($http, data, function (result) {
                        if (result.returnCode === '000') {
                            // 페이퍼 로드
                            LoadPaper($http, EditorData.paperId, function (result) {
                                EditorData.paper = result.result;
                                EditorData.paperTitle = result.result.title;

                                // reload
                                $('#' + $scope.data._id).remove();
                                loadArticle($scope.data ,$scope);
                            });

                        } else if (result.returnCode === '001') {
                        } else if (result.returnCode === '002') {
                        }
                    });

                }
            }
        };
    });

});
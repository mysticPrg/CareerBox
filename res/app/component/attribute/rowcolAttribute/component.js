
define([
    'app',
    'service/loadArticle',
    'service/reloadPaper'
], function (app) {

    app.directive('rowcolAttribute', function (loadArticle, reloadPaper) {
        return {
            restrict: 'A',
            scope: {
                data : "=to"
            },
            templateUrl: require.toUrl('component/attribute/rowcolAttribute/template.html'),
            link : function($scope, element, att) {
                $scope.reload = function() {
                    reloadPaper($scope, function(){
                        alert('성공했습니다.');
                    });
                }
            }
        };
    });

});
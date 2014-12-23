
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
            controller:function($scope){
                $scope.reload = function() {
                    $scope.$emit('reload');
                }

            }
        };
    });

});
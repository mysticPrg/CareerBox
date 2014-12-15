
define([
    'app'
], function (app, Color) {

    app.directive('isIndexAttribute', function () {
        return {
            restrict: 'A',
            scope: {
                data : "=to"
            },
            templateUrl: require.toUrl('component/attribute/isIndexAttribute/template.html'),
            link: function ($scope, element, att) {
                $scope.isIndex = $scope.data.isIndex;

                $scope.$watch("isIndex",function() {
//                    // 칼라를 바꾼다.
//                    $scope.data.font.color = new Color($scope.color.substring(1,$scope.color.length));
                },true);
            }
        };
    });

});

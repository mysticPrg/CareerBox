
define([
    'app',
    'classes/Structs/Color'
], function (app, Color) {

    app.directive('outlineAttribute', function () {
        return {
            restrict: 'A',
            scope: {
                data : "=to"
            },
            templateUrl: require.toUrl('component/attribute/outlineAttribute/template.html'),
            link: function ($scope) {

                $scope.$watch("data.outline.color",function() {
                    $scope.color = "#" + $scope.data.outline.color.R + $scope.data.outline.color.G + $scope.data.outline.color.B;

                },true);

                $scope.$watch("color",function() {
                    // 칼라를 바꾼다.
                    $scope.data.outline.color = new Color($scope.color.substring(1,$scope.color.length));
                },true);
            }
        };
    });

});

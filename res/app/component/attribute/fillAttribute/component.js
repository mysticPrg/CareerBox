define([
    'app',
    'classes/Structs/Color'
], function (app, Color) {

    app.directive('fillAttribute', function () {
        return {
            restrict: 'A',
            scope: {
                data : "=to"
            },
            templateUrl: require.toUrl('component/attribute/fillAttribute/template.html'),
            link: function ($scope, element, att) {

                $scope.$watch("data.fill.color",function() {
                    $scope.color = "#" + $scope.data.fill.color.R + $scope.data.fill.color.G + $scope.data.fill.color.B;

                },true);

                $scope.$watch("color",function() {
                    // 칼라를 바꾼다.
                    $scope.data.fill.color = new Color($scope.color.substring(1,$scope.color.length));
                },true);
            }
        };
    });

});


define([
    'app',
    'classes/Structs/Color'
], function (app, Color) {

    app.directive('fontAttribute', function () {
        return {
            restrict: 'A',
            scope: {
                data : "=to"
            },
            templateUrl: require.toUrl('component/attribute/fontAttribute/template.html'),
            link: function ($scope, element, att) {

                $scope.fontFamily = [
                // 영어 폰트
                    'alefhebrew',
                    'amiri',
                    'dhurjati',
                    'dhyana',
                // 한글 폰트
                    'hanna',
                    'jeju gothic',
                    'jeju myeongjo',
                    'jeju hallasan',
                    'kopub batang',
                    'nanum gothic',
                    'nanum gothiccoding',
                    'nanumm yeongjo',
                    'nanum brushscript',
                    'nanum penscript'

                ];

                $scope.$watch("data.font.color",function() {
                    $scope.color = "#" + $scope.data.font.color.R + $scope.data.font.color.G + $scope.data.font.color.B;

                },true);

                $scope.$watch("color",function() {
                    // 칼라를 바꾼다.
                    $scope.data.font.color = new Color($scope.color.substring(1,$scope.color.length));
                },true);

            }
        };
    });

});

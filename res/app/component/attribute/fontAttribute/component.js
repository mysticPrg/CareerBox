
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
            link: function ($scope) {

                $scope.fontFamily = {
                    // 영어폰트
                    'alefhebrew(영어)' : 'alefhebrew',
                    'amiri(영어)' : 'amiri',
                    'dhurjati(영어)' : 'dhurjati',
                    'dhyana(영어)' : 'dhyana',

                    // 한글 폰트
                    '한나' : 'hanna',
                    '제주 고딕' : 'jeju gothic',
                    '제주 명조' : 'jeju myeongjo',
                    '제주 한라산' : 'jeju hallasan',
                    '코펍 바탕' : 'kopub batang',
                    '나눔 고딕' : 'nanum gothic',
                    '나눔 고딕코딩' : 'nanum gothic coding',
                    '나눔 명조' : 'nanum myeongjo',
                    '나눔 브러쉬스크립트' : 'nanum brush script',
                    '나눔 펜스크립트' : 'nanum pen script'
                };

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

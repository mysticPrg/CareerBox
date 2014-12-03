/**
 * Created by gimbyeongjin on 14. 11. 19..
 */

define([
    'app',
    'jquery-ui',
    'services/SetAttributeInformation'
], function (app) {


    app.directive('line', ['SetAttributeInformation', function (SetAttributeInformation) {
        return {
            // A = attribute, E = Element, C = Class and M = HTML Comment
            restrict: 'A',

            //The link function is responsible for registering DOM listeners as well as updating the DOM.
            link: function (scope, element, att) {
                scope.attribute = SetAttributeInformation(att.id);
                scope.lineEnd = {};
                scope.style = {};

                function HexTo10(Hex){
                    return parseInt(Hex, 16).toString(10)
                };

                scope.$watch("attribute.outline.color", function () {
                    scope.style.fill = 'rgba(' + HexTo10(scope.attribute.outline.color.R) + ', '+HexTo10(scope.attribute.outline.color.G)+', '+HexTo10(scope.attribute.outline.color.B)+', '+scope.attribute.alpha/100+')';
                }, true);

                scope.$watch("attribute.alpha", function () {
                    scope.style.fill = 'rgba(' + HexTo10(scope.attribute.outline.color.R) + ', '+HexTo10(scope.attribute.outline.color.G)+', '+HexTo10(scope.attribute.outline.color.B)+', '+scope.attribute.alpha/100+')';
                }, true);

                scope.$watch("attribute.size", function () {
                    console.log('test', $(element).height());
                    var divWidth = $(element).width() == 0 ? (150 - 10) : ($(element).width() - 10 );
                    var divHeight = $(element).height() == 0 ? (150 - 10) : ($(element).height() - 10);

                    scope.lineEnd.x = divWidth;
                    scope.lineEnd.y = divHeight;
                }, true);

                // 화살표 사용여부
                scope.attribute.arrow.use

                // 화살표 방향
                scope.attribute.arrow.direction

                // 시작점
                scope.attribute.pos_start;

                // 끝점
                scope.attribute.pos_start;

            },
            templateUrl: require.toUrl('component/item/line/template.html')
        };
    }]);
});

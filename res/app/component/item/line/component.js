/**
 * Created by gimbyeongjin on 14. 11. 19..
 */

define([
    'app',
    'jquery-ui',
    'service/SetAttributeInformation',
    'service/ApplyCommonItemAttribute',
    'service/EditorData'

], function (app) {
    app.directive('ngX1', function () {
        return function (scope, element, attrs) {
            scope.attrs = attrs;
            scope.$watch('attrs.ngX1', function () {
                element.attr('x1', attrs.ngX1);
            }, true);
        };

    });
    app.directive('ngX2', function () {
        return function (scope, element, attrs) {
            scope.attrs = attrs;
            scope.$watch('attrs.ngX2', function () {
                element.attr('x2', attrs.ngX2);
            }, true);
        };
    });
    app.directive('ngY1', function () {
        return function (scope, element, attrs) {
            scope.attrs = attrs;
            scope.$watch('attrs.ngY1', function () {
                element.attr('y1', attrs.ngY1);
            }, true);
        };
    });
    app.directive('ngY2', function () {
        return function (scope, element, attrs) {
            scope.attrs = attrs;
            scope.$watch('attrs.ngY2', function () {
                element.attr('y2', attrs.ngY2);
            }, true);
        };
    });


    app.directive('line', ['SetAttributeInformation', 'ApplyCommonItemAttribute', 'EditorData', function (SetAttributeInformation, ApplyCommonItemAttribute, EditorData) {
        function HexTo10(Hex) {
            return parseInt(Hex, 16).toString(10);
        }

        function setLineSize(element, scope) {
            element.css({
                width: scope.attributeInformation.size.width + "px",
                height: scope.attributeInformation.outline.weight * 15 + "px"
            });
        }

        function setWatch(scope, element, att) {

            // outline.color
            scope.$watch("attributeInformation.outline.color", function () {
                scope.style.fill = 'rgba(' + HexTo10(scope.attributeInformation.outline.color.R) + ', ' + HexTo10(scope.attributeInformation.outline.color.G) + ', ' + HexTo10(scope.attributeInformation.outline.color.B) + ', ' + scope.attributeInformation.alpha / 100 + ')';
            }, true);

            // outline.weight
            scope.$watch("attributeInformation.outline.weight", function () {
                setLineSize(element, scope);
            }, true);

            // alpha
            scope.$watch("attributeInformation.alpha", function () {
                scope.style.fill = 'rgba(' + HexTo10(scope.attributeInformation.outline.color.R) + ', ' + HexTo10(scope.attributeInformation.outline.color.G) + ', ' + HexTo10(scope.attributeInformation.outline.color.B) + ', ' + scope.attributeInformation.alpha / 100 + ')';
            }, true);

            // pos
            scope.$watch("attributeInformation.pos", function () {
                if (EditorData.focusId === att.id) {
                    ApplyCommonItemAttribute.pos(element, scope.attributeInformation);
                }
            }, true);

            // size
            scope.$watch("attributeInformation.size", function () {

                setLineSize(element, scope);

                var divWidth = element.width() === 0 ? (150 - 10) : (element.width() - 10 );
                var divHeight = element.height() === 0 ? (150 - 10) : (element.height() - 10);

                scope.lineEnd.x = divWidth;
                scope.lineEnd.y = divHeight;

            }, true);

            // rotate
            scope.$watch("attributeInformation.rotate", function () {
                ApplyCommonItemAttribute.rotate(element, scope.attributeInformation);
            }, true);

            // z-watch
            scope.$watch("attributeInformation.zOrder", function () {
                if (scope.attributeInformation._id === att.id) {
                    ApplyCommonItemAttribute.zOrder(element, scope.attributeInformation);
                }
            }, true);

        }

        return {
            // A = attribute, E = Element, C = Class and M = HTML Comment
            restrict: 'A',
            scope: true,   // 새로운 스코프
            //The link function is responsible for registering DOM listeners as well as updating the DOM.
            link: function (scope, element, att) {

                // 모델 GET
                var info = SetAttributeInformation(att.id);
                scope.attributeInformation = info.attributeInformation;
                scope.type = info.type;

                scope.lineEnd = {};
                scope.style = {};

                // 아티클, 아이템 공통
                setWatch(scope, element, att);

                // 로딩시 CSS 적용
                ApplyCommonItemAttribute.fillLine(element, scope.attributeInformation);
                ApplyCommonItemAttribute.rotate(element, scope.attributeInformation);
                ApplyCommonItemAttribute.alphaLine(element, scope.attributeInformation);
                ApplyCommonItemAttribute.pos(element, scope.attributeInformation);
                ApplyCommonItemAttribute.zOrder(element, scope.attributeInformation);

                setLineSize(element, scope);

                scope.endArrow_id = 'endArrow_' + att.id;
                scope.startArrow_id = 'startArrow_' + att.id;


            },
            templateUrl: require.toUrl('component/item/line/template.html')
        };
    }]);
});

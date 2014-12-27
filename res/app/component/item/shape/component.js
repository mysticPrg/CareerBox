/**
 * Created by gimbyeongjin on 14. 11. 19..
 */
/**
 * Created by gimbyeongjin on 14. 10. 18..
 */

define([
    'app', 'jquery-ui', 'service/SetAttributeInformation'
], function (app) {
    app.directive('shape', ['SetAttributeInformation', function (SetAttributeInformation) {
        function modifyShapeType(scope, element) {
            if (scope.info.shapeType === "box") {
                element.css({
                    'border-radius': '0px'
                });
            } else {
                element.css({
                    'border-radius': '50%'
                });
            }
        }

        return {
            // A = attribute, E = Element, C = Class and M = HTML Comment
            restrict: 'A',
            scope: true,   // 새로운 스코프
            //The link function is responsible for registering DOM listeners as well as updating the DOM.
            link: function (scope, element, att) {
                scope.info = SetAttributeInformation(att.id).attributeInformation;

                // 쉐이프의 타입에 따라 css 변경
                scope.$watch("info.shapeType", function () {
                    modifyShapeType(scope, element);
                }, true);
            },
            templateUrl: require.toUrl('component/item/shape/template.html')
        };
    }]);
});

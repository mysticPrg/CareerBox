/**
 * Created by gimbyeongjin on 14. 11. 19..
 */
/**
 * Created by gimbyeongjin on 14. 10. 18..
 */

define([
    'app', 'jquery-ui', 'services/SetAttributeInformation'
], function (app) {
    app.directive('shape', ['SetAttributeInformation', function (SetAttributeInformation) {
        return {
            // A = attribute, E = Element, C = Class and M = HTML Comment
            restrict: 'A',

            //The link function is responsible for registering DOM listeners as well as updating the DOM.
            link: function (scope, element, att) {
                scope.info = SetAttributeInformation(att.id);

                // 쉐이프의 타입에 따라 css 변경
                scope.$watch("info.shapeType",function() {
                    if(scope.info.shapeType == "box")
                        element.css({
                            'border-radius': '0%'
                        });
                    else
                        element.css({
                            'border-radius': '50%'
                        });
                },true);
            },
            templateUrl: require.toUrl('component/item/shape/template.html')
        };
    }]);
});

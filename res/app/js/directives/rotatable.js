define([
    'app',
    'jquery-ui',
    'rotatable',
    'service/applyCommonItemAttribute',
    'service/EditorData'
], function (app) {
    app.directive('rotatable', function (applyCommonItemAttribute, $compile) {
        function getRotationRadian(obj) {
            var rad;
            var matrix = obj.css("-webkit-transform") ||
                obj.css("-moz-transform") ||
                obj.css("-ms-transform") ||
                obj.css("-o-transform") ||
                obj.css("transform");
            if (matrix !== 'none') {
                var values = matrix.split('(')[1].split(')')[0].split(',');
                var a = values[0];
                var b = values[1];
                rad = Math.atan2(b, a);

            } else {
                rad = 0;
            }
            return rad;
        }

        function getRotationDeg(rad) {
            return rad * 180 / Math.PI;
        }

        return {
            // A = attribute, E = Element, C = Class and M = HTML Comment

            restrict: 'A',
            link: function (scope, element, att) {
                var params = {
                    // Callback fired on rotation end.
                    stop: function () {
                        scope.attributeInformation.rotate = getRotationDeg(getRotationRadian(element));
                    }
                };
                element.rotatable(params);

                // 포커싱 되었을 때 handle이 보이도록 함
                scope.id = att.id;
                var handle = element.find('.ui-rotatable-handle');
                handle.attr('ng-show', "id == EditorData.focusId");
                $compile(handle)(scope);
            }
        };
    });
});
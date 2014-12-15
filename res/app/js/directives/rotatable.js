define([
    'app',
    'jquery-ui',
    'rotatable',
    'services/ApplyCommonItemAttribute'
], function (app) {
    app.directive('rotatable', function (ApplyCommonItemAttribute) {
        function getRotationRadian(obj) {
            var matrix = obj.css("-webkit-transform") ||
                obj.css("-moz-transform")    ||
                obj.css("-ms-transform")     ||
                obj.css("-o-transform")      ||
                obj.css("transform");
            if(matrix !== 'none') {
                var values = matrix.split('(')[1].split(')')[0].split(',');
                var a = values[0];
                var b = values[1];
                var rad = Math.atan2(b, a);
            } else { var rad = 0; }
            return rad;
        };

        return {
            // A = attribute, E = Element, C = Class and M = HTML Comment

            restrict:'A',
            link: function(scope, element, att) {
                var params = {
                    // Callback fired on rotation start.
                    start: function(event, ui) {
                    },
                    // Callback fired during rotation.
                    rotate: function(event, ui) {
                    },
                    // Callback fired on rotation end.
                    stop: function(event, ui) {
                        scope.attributeInformation.rotate = getRotationRadian(element);
                    }
                };

                element.rotatable(params);
            }
        };
    });
});
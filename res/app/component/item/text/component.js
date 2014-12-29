//define([
//    'app',
//    'jquery-ui',
//    'services/EditorData'
//], function (app) {
//
//
//    app.directive('text', ['EditorData', function (EditorData) {
//        return {
//            // A = attribute, E = Element, C = Class and M = HTML Comment
//            restrict: 'A',
//
//
//
//            templateUrl: require.toUrl('component/item/text/template.html')
//        };
//    }]);
//});

define([
    'app',
    'jquery-ui',
    'service/SetAttributeInformation'
], function (app) {

    function trim(str) {
        var result = '';
        var splitArr = str.split(' ');
        var key;
        for (key in splitArr) {
            result += splitArr[key];
        }
        return result;
    }

    function vAlign(scope, element) {

        var textElement;

        textElement = element.find('.whiteSpace');
        if (scope.info.vAlign === 'top') {
            textElement.css({
                'position': 'absolute',
                'transform': '',
                '-webkit-transform': '',

                'bottom': '',
                'top': "0px"
            });
        } else if (scope.info.vAlign === 'middle') {

            textElement.css({
                'position': 'relative',
                'top': '50%',
                'transform': 'translateY(-50%)',
                '-webkit-transform': 'translateY(-50%)'
            });

        } else if (scope.info.vAlign === 'bottom') {

            textElement.css({
                'position': 'absolute',
                'transform': '',
                '-webkit-transform': '',

                'top': '',
                'bottom': 0 + "px"
            });
        }

    }

    app.directive('text', ['SetAttributeInformation', function (SetAttributeInformation) {

        return {
            // A = attribute, E = Element, C = Class and M = HTML Comment
            restrict: 'A',
            scope: true,   // 새로운 스코프
            link: function (scope, element, att) {
                scope.info = SetAttributeInformation(att.id).attributeInformation;
                scope.style = {};

                // align
                scope.$watch("info.align", function () {

                });

                //vAlign
                scope.$watch("info", function () {

                    element.css({
                        'font-size': scope.info.font.size + "px"
                    });

                    element.css({
                        'font-family': "'" + trim(scope.info.font.family) + "', '" + scope.info.font.family + "'"
                    });

                    if (scope.info.font.bold) {
                        element.css({
                            'font-weight': "bold"
                        });
//                        scope.style['font-weight'] = "bold";
                    }
                    else {
                        element.css({
                            'font-weight': "normal"
                        });
//                        scope.style['font-weight'] = "normal";
                    }

                    element.css({
                        'color': "#" + scope.info.font.color.R + scope.info.font.color.G + scope.info.font.color.B
                    });

                    if (scope.info.font.italic) {
                        element.css({
                            'font-style': "italic"
                        });
//                        scope.style['font-style'] = "italic";
                    }
                    else {
                        element.css({
                            'font-style': "normal"
                        });
//                        scope.style['font-style'] = "normal";
                    }

                    element.css({
                        'text-align': scope.info.align
                    });

                    vAlign(scope, element);
                }, true);

                // font color
                scope.$watch("info.font.color", function () {

                });

                // font-bold
                scope.$watch("info.font.bold", function () {

                });

                // font-italic
                scope.$watch("info.font.italic", function () {

                });

            },
            templateUrl: require.toUrl('component/item/text/template.html')
        };
    }]);
});

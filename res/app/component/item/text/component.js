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

        var height, textElement, textElementHeight;

        height = scope.info.size.height;
        textElement = element.find('.whiteSpace');
        textElementHeight = textElement.height();

        if (scope.info.vAlign === 'top') {
            textElement.css({
                'top': "0px"
            });
        } else if (scope.info.vAlign === 'middle') {
            textElement.css({
                'top': parseInt(height / 2 - textElementHeight / 2) +"px"
            });

        } else if (scope.info.vAlign === 'bottom') {
            textElement.css({
                'top': (height - textElementHeight) + "px"
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
                    element.css({
                        'text-align': scope.info.align
                    });

//                    scope.style['text-align'] = scope.info.align;
                });

                //vAlign
                scope.$watch("info", function () {

                    element.css({
                        'font-size': scope.info.font.size + "px"
                    });

                    element.css({
                        'font-family': "'" + trim(scope.info.font.family) + "', '" + scope.info.font.family + "'"
                    });

                    vAlign(scope, element);
                }, true);

                // font color
                scope.$watch("info.font.color", function () {
                    element.css({
                        'color': "#" + scope.info.font.color.R + scope.info.font.color.G + scope.info.font.color.B
                    });
                });

                // font-bold
                scope.$watch("info.font.bold", function () {
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
                });

                // font-italic
                scope.$watch("info.font.italic", function () {
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
                });

            },
            templateUrl: require.toUrl('component/item/text/template.html')
        };
    }]);
});

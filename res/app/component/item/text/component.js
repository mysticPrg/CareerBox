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
        var result='';
        var splitArr = str.split(' ');
        for(var key in splitArr){
            result += splitArr[key];
        }
        return result;
    }

    function vAlign(scope, element) {
        if(scope.info.vAlign === 'top'){
            scope.style['top'] = '0px';
        } else if(scope.info.vAlign === 'middle') {
            var height = scope.info.size.height;
            var textElement = element.find('.whiteSpace');
            var textElementHeight = textElement.height();
            scope.style['top'] = height/2 - textElementHeight/2

        } else if(scope.info.vAlign === 'bottom'){
            var height = scope.info.size.height;
            var textElement = element.find('.whiteSpace');
            var textElementHeight = textElement.height();
            scope.style['top'] = height - textElementHeight
        }
    }

    app.directive('text', ['SetAttributeInformation', function (SetAttributeInformation) {
        return {
            // A = attribute, E = Element, C = Class and M = HTML Comment
            restrict: 'A',
            scope : true,   // 새로운 스코프
            link: function(scope, element, att) {

                scope.info = SetAttributeInformation(att.id).attributeInformation;
                scope.style = {};

                // align
                scope.$watch("info.align",function() {
                    scope.style['text-align'] = scope.info.align;
                });

                //vAlign
                scope.$watch("info",function() {
                    element.css({
                        'font-size' : scope.info.font.size + "px"
                    });
                    vAlign(scope, element);
                },true);

                // font color
                scope.$watch("info.font.color",function() {
                    scope.style['color'] = "#" + scope.info.font.color.R + scope.info.font.color.G + scope.info.font.color.B;
                });

                // font-family
                scope.$watch("info.font.family",function() {
                    element.css({
                        'font-family': "'" + trim(scope.info.font.family) + "', '" + scope.info.font.family + "'"
                    });
                });

                // font-bold
                scope.$watch("info.font.bold",function() {
                    if(scope.info.font.bold){
                        scope.style['font-weight'] = "bold";
                    }
                    else{
                        scope.style['font-weight'] = "normal";
                    }
                });

                // font-italic
                scope.$watch("info.font.italic",function() {
                    if(scope.info.font.italic){
                        scope.style['font-style'] = "italic";
                    }
                    else{
                        scope.style['font-style'] = "normal";
                    }
                });

            },
            templateUrl: require.toUrl('component/item/text/template.html')
        };
    }]);
});

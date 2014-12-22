define([
    'app',
    'jquery-ui',
    'service/SetAttributeInformation',
    'service/EditorData'
], function (app) {
    var vAlign = {
        top : '10%',
        middle : '50%',
        bottom : '90%'
    };
    app.directive('link', ['SetAttributeInformation', 'EditorData', '$window', function (SetAttributeInformation, EditorData, $window) {
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
                scope.$watch("info.vAlign",function() {
                    scope.style['top'] = vAlign[scope.info.vAlign];
                });

                // font color
                scope.$watch("info.font.color",function() {
                    scope.style['color'] = "#" + scope.info.font.color.R + scope.info.font.color.G + scope.info.font.color.B;
                });

                // font-size
                scope.$watch("info.font.size",function() {
                    scope.style['font-size'] = scope.info.font.size + "px";
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

                scope.goToPreview = function () {
                    // isOutURL 에 따라 분류
                    if(scope.info.isOutURL){
                        $window.open(scope.info.url);
                    }
                    else{
                        var href = 'portfolioPreview.html?id=' + EditorData.portfolio._id +'&paper_id=' + scope.info.url;
                        $window.open(href);
                    }
                };

            },
            templateUrl: require.toUrl('component/item/link/template.html')
        };
    }]);
});

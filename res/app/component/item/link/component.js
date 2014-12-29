define([
    'app',
    'jquery-ui',
    'service/SetAttributeInformation',
    'service/EditorData'
], function (app) {
    function trim(str) {
        var result = '';
        var splitArr = str.split(' ');
        for (var key in splitArr) {
            result += splitArr[key];
        }
        return result;
    }

    function vAlign(scope, element) {

        var textElement;

        textElement = element.find('.linkContent');
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

    app.directive('link', ['SetAttributeInformation', 'EditorData', '$window', function (SetAttributeInformation, EditorData, $window) {
        return {
            // A = attribute, E = Element, C = Class and M = HTML Comment
            restrict: 'A',
            scope: true,   // 새로운 스코프
            link: function (scope, element, att) {
                scope.info = SetAttributeInformation(att.id).attributeInformation;
                scope.style = {};

                // 첨부파일에 없을 경우
                if(scope.info.url === ''){
                    scope.info.value = '첨부파일없음';
                }

                // align
                scope.$watch("info.align", function () {
                    scope.style['text-align'] = scope.info.align;
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
                    scope.style.color = "#" + scope.info.font.color.R + scope.info.font.color.G + scope.info.font.color.B;
                });

                // font-bold
                scope.$watch("info.font.bold", function () {
                    if (scope.info.font.bold) {
                        scope.style['font-weight'] = "bold";
                    }
                    else {
                        scope.style['font-weight'] = "normal";
                    }
                });

                // font-italic
                scope.$watch("info.font.italic", function () {
                    if (scope.info.font.italic) {
                        scope.style['font-style'] = "italic";
                    }
                    else {
                        scope.style['font-style'] = "normal";
                    }
                });

                scope.goToPreview = function () {

                    // 에디터에서는 링크 걸리지 않게
                    if (window.location.href.indexOf('Editor') >= 0) {
                        return;
                    }

                    // isOutURL 에 따라 분류
                    var href;
                    if (scope.info.bindingType === "F_file") {
                        if(scope.info.url === ''){
                            return;
                        }
                        href = 'http://210.118.74.166:8123/file/' + scope.info.url;
                    }
                    else if (scope.info.isOutURL) {
                        href = scope.info.url;
                    }
                    else {
                        href = 'portfolioPreview.html?id=' + EditorData.portfolio._id + '&paper_id=' + scope.info.url;
                    }

                    // 새창에서 열것인가? 현재창에서 열것인가?
                    if (scope.info.isNewWindow) {
                        $window.open(href);
                    } else {
                        $window.location.href = href;
                    }
                };

            },
            templateUrl: require.toUrl('component/item/link/template.html')
        };
    }]);
});

define([
    'app', 'jquery-ui', 'service/SetAttributeInformation', 'service/EditorData'
], function (app) {
    app.directive('resizable', function (SetAttributeInformation, $compile, EditorData, $rootScope) {

        function isTemplateEditor(url) {
            if (url.indexOf('TemplateEditor') >= 0) {
                return true;
            } else {
                return false;
            }
        }

        function bindMousedown(element, scope) {
            element.bind('mouseup', function () {
                // 사이즈 업데이트
                if (scope.item) {
                    scope.item.size = {width: element.width(), height: element.height()};
                    if (scope.item.state !== 'new') {
                        scope.item.state = 'edit';
                    }
                }
            });
        }

        return {
            // A = attribute, E = Element, C = Class and M = HTML Comment

            restrict: 'A',
            link: function (scope, element, att) {

                scope.item = SetAttributeInformation(att.id).attributeInformation;

                if (att.id === 'canvas-content' && isTemplateEditor(window.location.href)) {

                    $rootScope.$on('getModel', function () {
                        scope.item = SetAttributeInformation(att.id).attributeInformation;
                        // 아티클, 아이템 공통
                        bindMousedown(element, scope);
                    });
                }

                // 캔버스
                if (att.id === 'canvas-content') {
                    element.resizable(
                        {
                            handles: "n, e, s, w, nw, ne, sw,se"
                        }
                    );
                } else if (scope.item.itemType === 'line') {
                    element.resizable(
                        {
                            handles: "e, w"
                        }
                    );
                } else {
                    element.resizable(
                        {
                            containment: '#canvas-content',
                            handles: "n, e, s, w, nw, ne, sw,se"
                        }
                    );
                }

                element.bind('mousedown', function () {
                    // 캔버스
                    if (att.id === 'canvas-content') {
                        // resize min width, height 지정
                        var minHeight = 0, minWidth = 0;
                        for (var key in EditorData.templateItemArray) {
                            var child = EditorData.templateItemArray[key];
                            console.log('EditorData.templateItemArray[key].state', EditorData.templateItemArray[key].state)
                            if(EditorData.templateItemArray[key].state !== 'del'){
                                var compareY = Number(child.pos.y) + Number(child.size.height) + Number(child.outline.weight) * 2;
                                if (minHeight < compareY) {
                                    minHeight = compareY;
                                }

                                var compareX = Number(child.pos.x) + Number(child.size.width) + Number(child.outline.weight) * 2;
                                if (minWidth < compareX) {
                                    minWidth = compareX;
                                }
                            }
                        }

                        element.resizable(
                            {
                                handles: "n, e, s, w, nw, ne, sw,se",
                                minHeight: minHeight,
                                minWidth: minWidth
                            }
                        );
                    }
                });


                bindMousedown(element, scope);

                // 포커싱 되었을 때 handle이 보이도록 함
                scope.id = att.id;
                var handle = element.find('.ui-resizable-handle');
                handle.attr('ng-show', "id == EditorData.focusId");
                $compile(handle)(scope);
            }
        };
    });
});
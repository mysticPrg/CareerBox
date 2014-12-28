/**
 * Created by JEONGBORAM-PC-W1 on 2014-11-17.
 */
define([
    'jquery',
    'angular',
    'app',
    'classes/Templates/Template',
    'classes/LayoutComponents/Article',
    'component/saveConfirmModal/component',
    'directives/draggable',
    'directives/resizable',
    'service/EditorData',
    'service/HTMLGenerator',
    'service/getTemplate',
    'service/SaveTemplate',
    'service/SetAttributeInformation',
    'component/templatePanel/component'
], function ($, ng, app, Template, Article, saveConfirmModal) {
    app.controller('TemplateEditor', ['$scope', '$rootScope', '$http', '$modal', '$window', '$compile', 'EditorData', 'HTMLGenerator', 'getTemplate', 'SaveTemplate', 'SetAttributeInformation',
        function ($scope, $rootScope, $http, $modal, $window, $compile, EditorData, HTMLGenerator, getTemplate, SaveTemplate, SetAttributeInformation) {
            EditorData.editorType = 'template';
            $scope.changed = false;

            // z index 초기화
            EditorData.end_zOrder = 0;
            EditorData.start_zOrder = 0;

            $scope.template = new Template();

            // 템플릿 속성
            $('#canvas-content').bind('click', function () {
                // 포커싱 처리
                EditorData.focusId = 'canvas-content';
            });

            $(document).ready(function () {
                $scope.orientation = "horizontal";
                $scope.panes = [
                    {collapsible: true, size: "320px"},
                    {collapsible: false}
                ];

                $('#canvas-content').find('div').remove();
                EditorData.templateItemArray = [];

                var url = $window.location.href;

                if (isLoaded(url)) {
                    var _id = url.split('TemplateEditor')[1].split('?id=')[1];

                    getTemplate($http, _id, function (data) {
                        // 로드 시 바인딩 bindingChanged 초기화
                        data.result.target.bindingChanged = false;
                        EditorData.template = new Template(data.result);
                        $scope.template = EditorData.template;
                        loadTemplate();

                        $scope.$emit('getModel');
                    });

                } else {
                    getTemplateInstance();
                }

                EditorData.focusId = EditorData.template._id;
                if (EditorData.template._id === null) {
                    EditorData.focusId = 'canvas-content';
                    $scope.$emit('changeAttributePanelModel');
                }

                // changed 초기화
                $scope.changed = false;
                isFirst = true;
            });

            // 방향키로 item 움직이도록 처리
            $(document).on('keydown', function (e) {
                var result = true;
                if (EditorData.focusId === 'canvas-content' || EditorData.focusInput === true) {
                    return result;
                }

                var focusObejct = SetAttributeInformation(EditorData.focusId).attributeInformation;

                var direction, value;
                switch (e.keyCode) {
                    case 38:
                        focusObejct.pos.y -= 5;
                        if (focusObejct.pos.y < 0) {
                            focusObejct.pos.y = 0;
                        }
                        direction = 'top';
                        value = focusObejct.pos.y;
                        result = false;
                        break;
                    case 40:
                        focusObejct.pos.y += 5;
                        if (focusObejct.pos.y + focusObejct.size.height > EditorData.paper.size.height) {
                            focusObejct.pos.y = EditorData.paper.size.height - focusObejct.size.height;
                        }
                        direction = 'top';
                        value = focusObejct.pos.y;
                        result = false;
                        break;
                    case 37:
                        focusObejct.pos.x -= 5;
                        if (focusObejct.pos.x < 0) {
                            focusObejct.pos.x = 0;
                        }
                        direction = 'left';
                        value = focusObejct.pos.x;
                        result = false;
                        break;
                    case 39:
                        focusObejct.pos.x += 5;
                        if (focusObejct.pos.x + focusObejct.size.width > EditorData.paper.size.width) {
                            focusObejct.pos.x = EditorData.paper.size.width - focusObejct.size.width;
                        }
                        direction = 'left';
                        value = focusObejct.pos.x;
                        result = false;
                        break;
                }

                $('#' + EditorData.focusId).css(direction, value + 'px');
                $compile('#posAttribute')($scope);
                return result;
            });

            // input이 선택되면 focusInput = true;
            $(document).on('mousedown', function (e) {
                if (isFocusInput(e.target)) {
                    EditorData.focusInput = true;
                } else {
                    EditorData.focusInput = false;
                }

                return true;
            });

            function isFocusInput(target) {
                var targetTagName = target.tagName;
                if ((targetTagName === 'INPUT') || (targetTagName === 'TEXTAREA')) {
                    return true;
                } else {
                    return false;
                }
            }

            function isLoaded(url) {
                var urlParse = url.split('TemplateEditor');
                if (urlParse[1] === '') {
                    return false;
                } else {
                    return true;
                }
            }

            // 로딩된 처음은 무조건 EditorData.templateItemArray watch가 발생하기 때문에 첫번째는 무시
            var isFirst = true;
            $scope.$watch("EditorData.templateItemArray", function () {
                if (!isFirst && EditorData.paper) {
                    $scope.changed = true;
                } else {
                    isFirst = false;
                }
            }, true);

            // Get Template Instance
            function getTemplateInstance() {
                var template = EditorData.template;
                var newTemplate = new Template();
                newTemplate.title = template.title;
                newTemplate.description = template.description;

                newTemplate.target.bindingType = template.target.bindingType;
                newTemplate.target.size = {width: 600, height: 400};
                newTemplate.target.outline.weight = 0;

                $scope.template = newTemplate;

                EditorData.template = newTemplate;

                // 템플릿 생성하고 나면 캔버스 속성이 나오도록함.
                EditorData.focusId = 'canvas-content';
            }

            // Load Element
            function loadTemplate() {
                var size = $scope.template.target.size;
                loadEditorCanvas(size);

                var itemArray = $scope.template.target.childArr[0];
                for (var index = 0; index < itemArray.length; index++) {
                    delete itemArray[index].state;
                    EditorData.templateItemArray[itemArray[index]._id] = itemArray[index];
                }
                loadTemplateElement();
            }

            function loadEditorCanvas(size) {
                $('#canvas-content').width(size.width);
                $('#canvas-content').height(size.height);
            }

            function loadTemplateElement() {
                for (var key in EditorData.templateItemArray) {
                    loadElement(EditorData.templateItemArray[key]);
                }
            }

            // 템플릿에서 edit 눌러서 저장된 아이템이 로드될 때 발생!
            function loadElement(item) {
                var option = {draggable: true, resizable: true, rotatable: true};

                var domObj = HTMLGenerator('loadItem', item, item._id, option);

                $('#canvas-content').append(domObj);
                $compile($('#' + item._id))($scope);

//            EditorData.focusId = id;    // 포커스 지정
                EditorData.end_zOrder++;
            }

            function getTemplateChildArr(ItemArray) {
                // array copy
                var templateItemArray = [];
                var key;
                for (key in ItemArray) {
                    templateItemArray[key] = ItemArray[key];
                }

                var templateChildArr = [];

                for (key in templateItemArray) {

                    var item = templateItemArray[key];

                    if (item.state === 'new') {
                        delete item._id;
                    }

                    if (item.state === 'del') {
                        continue;
                    }

                    delete item.state;

                    templateChildArr.push(item);
                }

                return templateChildArr;
            }


            $scope.save = function () {
                if ($scope.saveRock === true) {
                    return;
                }

                $scope.saveRock = true;
                EditorData.focusId = '';

                $scope.template.target.childArr[0] = getTemplateChildArr(EditorData.templateItemArray);

                $scope.thumbnail = '';
                $scope.description = EditorData.template.description;
                $scope.title = EditorData.template.title;

                SaveTemplate($http, $scope.template, function (result) {
                    if (result.returnCode === '000') {
                        $scope.changed = false;
                        $scope.template._id = result.result;
                        showSuccessNotification();
                    } else if (result.returnCode === '001') {
                        showFailNotification('실패하였습니다.');
                    } else if (result.returnCode === '002') {
                        showFailNotification('로그인 필요');
                    }
                });
            };

            $scope.movePaperEditor = function () {
                if ($scope.changed === true) {
                    var modalInstance = $modal.open(saveConfirmModal);
                    modalInstance.result.then(function () {
                        $.when($scope.save()).then(function () {
                            $window.location.href = '#portfolioEditor';
                        });
                    }, function () {
                        $window.location.href = '#portfolioEditor';
                    });
                } else {
                    $window.location.href = '#portfolioEditor';
                }
            };

            function showSuccessNotification() {
                var notification = kendo.toString('성공하였습니다.');
                $scope.template_noti.show(notification, "info");
                $scope.saveRock = false;
            }

            function showFailNotification(text) {
                var notification = kendo.toString(text);
                $scope.template_noti.show(notification, "error");
            }
        }]);
});
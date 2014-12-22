/**
 * Created by JEONGBORAM-PC-W1 on 2014-12-01.
 */
/**
 * Created by JEONGBORAM-PC-W1 on 2014-11-17.
 */
define([
    'jquery',
    'angular',
    'app',
    'classes/Paper',
    'classes/LayoutComponents/Article',
    'component/createTemplateModal/component',
    'component/saveConfirmModal/component',
    'directives/draggable',
    'directives/resizable',
    'directives/rotatable',
    'service/EditorData',
    'service/loadArticle',
    'service/HTMLGenerator',
    'service/LoadPaperList',
    'service/SavePaper',
    'service/LoadPaper',
    'service/WaitServer',
    'component/paperPanel/component'
], function ($, ng, app, Paper, Article, createTemplateModal, saveConfirmModal) {
    app.controller('PaperEditorController', ['$scope', '$rootScope', '$http', '$modal', '$window', '$compile', 'EditorData', 'HTMLGenerator', 'LoadPaperList', 'SavePaper', 'LoadPaper', 'loadArticle', 'WaitServer',
        function ($scope, $rootScope, $http, $modal, $window, $compile, EditorData, HTMLGenerator, LoadPaperList, SavePaper, LoadPaper, loadArticle, WaitServer) {
            EditorData.editorType = 'paper';
            $scope.paperChanged = false;

            $scope.paper;

            $scope.paperItemArray = [];

            $(document).ready(function () {

                // templateState값이 변경됨에 따라 저장 여부 판단
                EditorData.templateState = '';

                $scope.orientation = "horizontal";

                $scope.panes = [
                    {collapsible: true, size: "300px"},
                    {collapsible: false}
                ];

                EditorData.focusId = EditorData.paper._id;
            });

            // 페이퍼 속성
            $('#canvas-content').bind('click', function () {
                // 포커싱 처리
                EditorData.focusId = 'canvas-content';
            });

            $rootScope.$on("deleteArticle", function (e, id) {
                deleteArticle(id);
            });

            // 페이지 바꿧을때  loadPaper()를 다시;
            $scope.$watch("EditorData.paperId", function () {
                if (EditorData.paperId === '')
                    return;

                loadPaper();
            });

            function loadPaper() {
                initPaper();

                LoadPaper($http, EditorData.paperId, function (result) {
                    EditorData.paper = result.result;
                    EditorData.paperTitle = result.result.title;

                    loadPaperDom(EditorData.paper);

                    // 속성창 갱신 Second Task
                    EditorData.focusId = "canvas-content";

                    // changed 초기화
                    $scope.changed = false;
                    isFirst = true;
                });
            }

            // 로딩된 처음은 무조건 EditorData.paper watch가 발생하기 때문에 첫번째는 무시
            var isFirst = true;
            $scope.EditorData.paper = EditorData.paper;
            $scope.$watch("EditorData.paper", function () {
                if (!isFirst && EditorData.paper) {
                    $scope.changed = true;
                } else {
                    isFirst = false;
                }
            }, true);

            // childArr watch 하지만 acticle은 object로 인식 >> watch가 안됨..
            $scope.EditorData.childArr = EditorData.childArr;
            $scope.$watch("EditorData.childArr", function () {
                if (EditorData.childArr) {
                    $scope.changed = true;
                }
            }, true);

            $scope.$watch("EditorData.templateState", function () {


                if (EditorData.templateState !== '') {
                    if ($scope.changed) {
                        var modalInstance = $modal.open(saveConfirmModal);
                        modalInstance.result.then(function () {
                            $scope.save();

                            templateStateProcess();
                        }, function () {
                            templateStateProcess();
                        })
                    } else templateStateProcess();
                }
            });

            function templateStateProcess() {
                if (EditorData.templateState === 'new') {
                    createTemplate();
                } else if (EditorData.templateState === 'edit') {
                    $window.location.href = "#/TemplateEditor";
                }
            }

            function createTemplate() {
                var modalInstance = $modal.open(createTemplateModal);
                modalInstance.result.then(function (template) {
                    EditorData.template.title = template.title;
                    EditorData.template.description = template.description;
                    $window.location.href = "#/TemplateEditor";
                }, function () {
                });
            }

            function initPaper() {
                $('#canvas-content').find('div').remove();

                $scope.paper = new Paper();
                EditorData.childArr = [];

                // z index 초기화
                EditorData.end_zOrder = 0;
                EditorData.start_zOrder = 0;
            }

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            function loadPaperDom(paper) {
                var paperChildArr = paper.childArr;

                $compile($('#canvas-content'))($scope); // 페이퍼 속성을 적용시켜줌.

                var child;
                for (var index = 0; index < paperChildArr.length; index++) {
                    child = paperChildArr[index];
                    EditorData.childArr[child._id] = child;
                    if (child.childArr) {
                        loadArticle(child, $scope);

                    } else {
                        loadItem(child);
                    }
                }
            }

            function loadItem(item) {
                var option = {draggable: true, resizable: true, rotatable: true};

                var domObj = HTMLGenerator('loadItem', item, item._id, option);

                $('#canvas-content').append(domObj);
                $compile($('#' + item._id))($scope);
            }

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            function getPaperChildArr(childArr) {
                var paperChildArr = new Array();

                for (var key in childArr) {
                    var child = childArr[key];

                    if (child.state == 'new') {
                        delete child._id;
                    }

                    if (child.state == 'del') {
                        continue;
                    }

                    delete  child.state;

                    paperChildArr.push(child);
                }

                return paperChildArr;
            }

            $scope.save = function () {
                $scope.paper = EditorData.paper;
                $scope.paper.childArr = getPaperChildArr(EditorData.childArr);
                var data = {_portfolio_id: EditorData.portfolio._id, paper: $scope.paper};

                WaitServer.show();

                SavePaper($http, data, function (result) {
                    WaitServer.hide();
                    console.log('save data', data);
                    if (result.returnCode === '000') {
                        $scope.changed = false;
                        showSuccessNotification();
                    } else if (result.returnCode === '001') {
                        showFailNotification('실패하였습니다.');
                    } else if (result.returnCode === '002') {
                        showFailNotification('로그인 필요');
                    }
                });

            }

            $('#canvas-content').droppable({
                activeClass: "drop-area",
                drop: function (e, ui) {            // 드롭될 경우
                    var id = ui.draggable[0].getAttribute("id");
                }
            });

            function deleteArticle(id) {
                $('#' + id).remove();
                EditorData.childArr[id].state = 'del';
            }

            function showSuccessNotification() {
                var notification = kendo.toString('성공하였습니다.');
                $scope.noti.show(notification, "info");
            }

            function showFailNotification(text) {
                var notification = kendo.toString(text);
                $scope.noti.show(notification, "error");
            }
        }]);
});

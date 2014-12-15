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
    'component/createTemplateModal/component',
    'component/saveConfirmModal/component',
    'directives/draggable',
    'directives/resizable',
    'services/EditorData',
    'services/HTMLGenerator',
    'services/LoadPaperList',
    'services/SavePaper',
    'services/LoadPaper',
    '../../component/paperPanel/component'
], function ($, ng, app, Paper, createTemplateModal, saveConfirmModal) {
    app.controller('PaperEditorController', ['$scope', '$rootScope', '$http', '$modal', '$window', '$compile', 'EditorData', 'HTMLGenerator', 'LoadPaperList', 'SavePaper', 'LoadPaper',
        function ($scope, $rootScope, $http, $modal, $window, $compile, EditorData, HTMLGenerator, LoadPaperList, SavePaper, LoadPaper) {
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
            });

            // 페이퍼 속성
            $('#canvas-content').bind('click', function () {
                // 포커싱 처리
                EditorData.focusId = 'canvas-content';
            });

            $rootScope.$on("deleteArticle", function (e, id) {
                deleteArticle(id);
            });

            $scope.$watch("EditorData.paperId", function () {
                if (EditorData.paperId === '')
                    return;

                initPaper();

                LoadPaper($http, EditorData.paperId, function (result) {
                    EditorData.paper = result.result;

                    loadPaper(EditorData.paper);

//                    $compile($('#canvas-content'))($scope);
                    // 이후에 child가 로드되어야함.
                });
            });

            $scope.$watch("EditorData.paper", function () {
                $scope.changed = true;
            }, true);

            $scope.$watch("EditorData.templateState", function () {
                if(EditorData.templateState !== ''){
                    var modalInstance = $modal.open(saveConfirmModal);
                    modalInstance.result.then(function () {
                        $scope.save();

                        templateStateProcess();
                    }, function () {
                        templateStateProcess();
                    })
                }
            });

            function templateStateProcess(){
                if(EditorData.templateState === 'new'){
                    createTemplate();
                }else if(EditorData.templateState === 'edit'){
                    $window.location.href = "#/TemplateEditor";
                }

                EditorData.templateState = '';
            }

            function createTemplate(){
                var modalInstance = $modal.open(createTemplateModal);
                modalInstance.result.then(function (template) {
                    EditorData.template.title = template.title;
                    EditorData.template.description = template.description;
                    $window.location.href = "#/TemplateEditor";
                }, function () {
                });
            }

            function initPaper(){
                $('#canvas-content').find('div').remove();

                $scope.paper = new Paper();
                EditorData.childArr = [];

                // z index 초기화
                EditorData.end_zOrder = 0;
                EditorData.start_zOrder = 0;
            }

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            function loadPaper(paper) {
                var paperChildArr = paper.childArr;

                $compile($('#canvas-content'))($scope); // 페이퍼 속성을 적용시켜줌.

                var child;
                for (var index = 0; index < paperChildArr.length; index++) {
                    child = paperChildArr[index];
                    EditorData.childArr[child._id] = child;
                    if (child.childArr) {
                        loadArticle(child);
                    }else{
                        loadItem(child);
                    }
                }
            }

            function loadArticle(article) {
                var option = {draggable: true, resizable: false};

                var ArticleDom = HTMLGenerator('loadDivDom', article, '', option);

                var width = 0, height = 0;

                var templateItemArray = article.childArr;
                EditorData.end_zOrder++;
                var itemOption = {draggable: false, resizable: false};

                var articleItemId;
                for (var index = 0; index < templateItemArray.length; index++) {
                    // Item of article 's id = template id_item id
                    articleItemId = article._id + '_load_' + templateItemArray[index]._id;
                    ArticleDom += HTMLGenerator('loadItem', templateItemArray[index], articleItemId, itemOption);
                }

                ArticleDom += '</div>';

                $('#canvas-content').append(ArticleDom);
                $compile($('#' + article._id))($scope);
            }

            function loadItem(item) {
                var option = {draggable: true, resizable: true};

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

                SavePaper($http, data, function (result) {
                    if(result.returnCode === '000'){
                        $scope.changed = false;
                        alert('저장되었습니다.');
                    }
                });

            }

            function updateModel(id, draggable) {

                var child;

                child = EditorData.childArr[id];

//            ** do not override item id
//            child._id = id;
                child.pos = {x: draggable.position().left, y: draggable.position().top};
                child.size = {width: draggable.width(), height: draggable.height()};

                EditorData.childArr[id] = child;
            }

            $('#canvas-content').droppable({
                activeClass: "drop-area",
                drop: function (e, ui) {            // 드롭될 경우
                    var id = ui.draggable[0].getAttribute("id");

                    updateModel(id, ui.draggable);
                }
            });

            function deleteArticle(id) {
                $('#' + id).remove();
                EditorData.childArr[id].state = 'del';
            }
        }]);
});

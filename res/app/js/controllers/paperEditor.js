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
    'directives/draggable',
    'directives/resizable',
    'services/EditorData',
    'services/HTMLGenerator',
    'services/LoadPaperList',
    'services/SavePaper',
    'services/LoadPaper',
    '../../component/paperPanel/component'
], function ($, ng, app, Paper) {
    app.controller('PaperEditorController', ['$scope', '$rootScope', '$http', '$window', '$compile', 'EditorData', 'HTMLGenerator', 'LoadPaperList', 'SavePaper', 'LoadPaper',
        function ($scope, $rootScope, $http, $window, $compile, EditorData, HTMLGenerator, LoadPaperList, SavePaper, LoadPaper) {

            // 페이퍼 속성
            $('#canvas-content').bind('click', function () {
                // 포커싱 처리
                EditorData.focusId = EditorData.paperId;
            });


            $scope.paper;

            $scope.paperItemArray = [];

            $(document).ready(function () {


                $scope.orientation = "horizontal";
                $scope.panes = [
                    {collapsible: true, size: "300px"},
                    {collapsible: false}
                ];
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
                });
            });

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
//                console.log(paper.childArr);

                var child;
                for (var index = 0; index < paperChildArr.length; index++) {
                    child = paperChildArr[index];
                    if (child.childArr) {
                        EditorData.childArr[child._id] = child;
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

                //TODO 병진 : 이 부분 확인 좀
//                EditorData.focusId = id;    // 포커스 지정
//                EditorData.end_zOrder++;
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

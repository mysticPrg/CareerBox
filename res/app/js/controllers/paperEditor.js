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
            $('#canvas-content').bind('click', function (){
                // 포커싱 처리
                EditorData.focusId = EditorData.paperId;
            });


            $scope.paper = new Paper();

            $scope.paperItemArray = [];

            $(document).ready(function () {


                $scope.orientation = "horizontal";
                $scope.panes = [
                    {collapsible: true, size: "300px"},
                    {collapsible: false}
                ];
            });

            $scope.$watch("EditorData.paperId", function() {
                if(EditorData.paperId === '')
                    return;

                LoadPaper($http, EditorData.paperId, function (result) {
                    // z index 초기화
                    EditorData.end_zOrder = 0;
                    EditorData.start_zOrder = 0;

                    EditorData.paper = result.result;
                    loadPaper(EditorData.paper);
                });
            });

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            function loadPaper(paper) {
                var articleArray = paper.childArr;

                var article;
                for (var index = 0; index < articleArray.length; index++) {
                    article = articleArray[index];
                    if(article.childArr){
                        EditorData.childArr[article._id] = article;
                        loadArticle(article);
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
                    articleItemId = article._id + '_load_' +templateItemArray[index]._id;
                    ArticleDom += HTMLGenerator('loadItem', templateItemArray[index], articleItemId, itemOption);
                }

                ArticleDom += '</div>';

                $('#canvas-content').append(ArticleDom);
                $compile($('#'+article._id))($scope);
            }
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            function getPaperChildArr(childArr) {
                var paperChildArr = new Array();

                for (var key in childArr) {
                    var child = childArr[key];

                    if (child.state == 'new') {
                        delete child._id;
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
                    console.log(result);
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
        }]);
});

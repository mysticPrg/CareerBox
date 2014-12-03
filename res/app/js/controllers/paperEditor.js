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
    'classes/Templates/Template',
    'classes/LayoutComponents/Items/Icon',
    'classes/LayoutComponents/Items/Image',
    'classes/LayoutComponents/Items/Item',
    'classes/LayoutComponents/Items/Line',
    'classes/LayoutComponents/Items/Link',
    'classes/LayoutComponents/Items/Shape',
    'classes/LayoutComponents/Items/Text',
    'directives/draggable',
    'directives/resizable',
    'services/EditorData',
    'services/HTMLGenerator',
    'services/LoadPaperList',
    'services/SavePaper',
    'services/LoadPaper',
    '../../component/paperPanel/component'
], function ($, ng, app, Paper, Template, Icon, Image, Item, Line, Link, Shape, Text) {
    app.controller('PaperEditorController', ['$scope', '$rootScope', '$http', '$window', '$compile', 'EditorData', 'HTMLGenerator', 'LoadPaperList', 'SavePaper', 'LoadPaper',
        function ($scope, $rootScope, $http, $window, $compile, EditorData, HTMLGenerator, LoadPaperList, SavePaper, LoadPaper) {
            $scope.paper = new Paper();
            $scope.paperId = '';

            $scope.paperItemArray = [];

            $(document).ready(function () {
                $scope.orientation = "horizontal";
                $scope.panes = [
                    {collapsible: true, size: "300px"},
                    {collapsible: false}
                ];

                LoadPaperList($http, EditorData.portfolio._id, function (result) {
                    EditorData.paperList = result.result;

                    if (EditorData.paperList.length > 0) {
                        $scope.paperId = EditorData.paperList[0]._id;
                        LoadPaper($http, $scope.paperId, function (result) {
                            EditorData.paper = result.result;
//                        console.log(EditorData.paper);
//                        console.log('//////////////////');
//                        console.log(EditorData.paper.childArr);
                            loadPaper(EditorData.paper);

                        });
                    }
                });
            });

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            function loadPaper(paper) {

                var articleArray = paper.childArr;

                var article;
                for (var index = 0; index < articleArray.length; index++) {
                    article = articleArray[index];
                    EditorData.childArr[article._id] = article;
                    loadArticle(article);
                }
            }

            function loadArticle(article) {
                var option = {draggable: true, resizable: false};

                var ArticleDom = HTMLGenerator('loadDivDom', article, '', option);

                var width = 0, height = 0;

                var templateItemArray = article.childArr;
                var item;
                for (var index = 0; index < templateItemArray.length; index++) {
                    item = templateItemArray[index];
                    if (width < (item.pos.x + item.size.width)) {
                        width = (item.pos.x + item.size.width);
                    }

                    if (height < (item.pos.y + item.size.height)) {
                        height = (item.pos.y + item.size.height);
                    }
                }

                var itemOption = {draggable: false, resizable: false};

                var articleItemId;
                for (var index = 0; index < templateItemArray.length; index++) {
                    // Item of article 's id = template id_item id
                    articleItemId = article._id + '_' +templateItemArray[index]._id;
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
                $scope.paper._portfolio_id = EditorData.portfolio._id;
                $scope.paper._id = $scope.paperId;
                $scope.paper.childArr = getPaperChildArr(EditorData.childArr);
                var data = {_portfolio_id: EditorData.portfolio._id, paper: $scope.paper};

                console.log($scope.paper);
                console.log('//////////////////');
                console.log($scope.paper.childArr);

                SavePaper($http, data, function (result) {
                    console.log(result);
                });

            }

            function updateModel(id, draggable) {

                var child;
                // child는 포지션이 들어가야할 대상임.
                // 경우에 따라서 child가 달라짐.
                // 보람의 아이디 정책 변경 이후 업데이트 모듈을 드래그로 넣어두겠음.

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

/**
 * Created by JEONGBORAM-PC-W1 on 2014-12-15.
 */
define([
    'jquery',
    'angular',
    'app',
    'classes/Paper',
    'classes/LayoutComponents/Article',
    'service/EditorData',
    'service/HTMLGenerator',
    'service/LoadPaperList',
    'service/LoadPaper',
    'component/item/line/component',
    'component/item/shape/component',
    'component/item/text/component',
    'component/item/link/component',
    'component/item/image/component',
    'directives/CommonAttribute'
], function ($, ng, app, Paper, Article, EditorData) {
    app.controller('portfolioPreview', ['$scope', '$http', '$compile', 'EditorData', 'HTMLGenerator', 'LoadPaperList', 'LoadPaper', function ($scope, $http, $compile, EditorData, HTMLGenerator, LoadPaperList, LoadPaper) {
        $scope.paper;

        $scope.paperItemArray = [];

        $(document).ready(function () {
            EditorData.portfolio._id = window.location.href.split("id=")[1].split("&")[0];

            EditorData.paper_id = window.location.href.split("paper_id=")[1];

            // 만약에 paper_id 가 없으면 index페이지로 이동.

            initPaper();

            LoadPaperList($http, EditorData.portfolio._id, function (result) {
                EditorData.paperList = result.result;
                $scope.papers = result.result;

                var paper;
                for(var idx = 0; idx < $scope.papers.length; idx++){
                    paper = $scope.papers[idx];

                    if(!EditorData.paper_id && paper.isIndex === true){
                        EditorData.paperId = paper._id;

                        LoadPaper($http, EditorData.paperId, function (result) {
                            EditorData.paper = result.result;

                            loadPaper(EditorData.paper);
                        });
                        return;
                    }

                    if(paper._id === EditorData.paper_id){

                        EditorData.paperId = paper._id;

                        LoadPaper($http, EditorData.paperId, function (result) {
                            EditorData.paper = result.result;

                            loadPaper(EditorData.paper);
                        });
                        return;
                    }
                }
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

        function loadArticle(_article) {
            var articleGroup = new Article(_article);
            var bindingCount = _article.bindingData.length === 0? 1: _article.bindingData.length;
            articleGroup.size.width = (_article.size.width * _article.colCount);
            articleGroup.size.height = (_article.size.height * _article.rowCount);

            var articleGroupDom = HTMLGenerator('loadDivDom', articleGroup, '', {draggable: true, resizable: false, grid: true});

            var article;
            for (var row = 0; row < _article.rowCount; row++) {
                for (var col = 0; col < _article.colCount; col++) {
                    var index = (row * _article.colCount) + col;
                    // Prevent to load Binding Item of null binding data
                    if(index >= bindingCount)
                        break;

                    article = new Article(_article);

                    article.col = col;
                    article.row = row;

                    article.childArr = _article.childArr[index];
                    article.tempIndex = index;


                    articleGroupDom += loadArticleDom(article);
                }
            }

            articleGroupDom += '</div>';

            $('#canvas-content').append(articleGroupDom);
            $compile($('#' + _article._id))($scope);
        }

        function loadArticleDom(article) {
            article._id += '_' + article.tempIndex;
            var ArticleDom = HTMLGenerator('loadDivDom', article, '', {draggable: false, resizable: false, row: article.row, col: article.col});

            var templateItemArray = article.childArr;
            EditorData.end_zOrder++;

            var articleItemId;

            for (var index = 0; index < templateItemArray.length; index++) {
                // Item of article 's id = template id_item id
                articleItemId = article._id + '_load_' + templateItemArray[index]._id + '_' + article.tempIndex;
                ArticleDom += HTMLGenerator('loadItem', templateItemArray[index], articleItemId, {draggable: false, resizable: false});
            }

            ArticleDom += '</div>';

            return ArticleDom;
        }

        function loadItem(item) {
            var option = {draggable: false, resizable: false};

            var domObj = HTMLGenerator('loadItem', item, item._id, option);

            $('#canvas-content').append(domObj);
            $compile($('#' + item._id))($scope);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    }]);
});





/**
 * Created by JEONGBORAM-PC-W1 on 2014-12-15.
 */
define([
    'jquery',
    'angular',
    'app',
    'classes/Paper',
    'services/EditorData',
    'services/HTMLGenerator',
    'services/LoadPaperList',
    'services/LoadPaper',
    'component/item/line/component',
    'component/item/shape/component',
    'component/item/text/component',
    'component/item/link/component',
    'component/item/image/component',
    'directives/CommonAttribute'
], function ($, ng, app, Paper, EditorData) {
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

        function loadArticle(article) {
            var option = {draggable: false, resizable: false};

            var ArticleDom = HTMLGenerator('loadDivDom', article, '', option);

            var width = 0, height = 0;

            var templateItemArray = article.childArr[0];
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
            var option = {draggable: false, resizable: false};

            var domObj = HTMLGenerator('loadItem', item, item._id, option);

            $('#canvas-content').append(domObj);
            $compile($('#' + item._id))($scope);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    }]);
});





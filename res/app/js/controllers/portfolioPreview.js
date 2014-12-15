/**
 * Created by JEONGBORAM-PC-W1 on 2014-12-15.
 */
define([
    'jquery',
    'angular',
    'app',
    'classes/Paper',
    'services/PreviewData',
    'services/HTMLGenerator',
    'services/LoadPaperList',
    'services/LoadPaper'
], function ($, ng, app, Paper, PreviewData) {
    app.controller('portfolioPreview', ['$scope', '$http', '$compile', 'PreviewData', 'HTMLGenerator', 'LoadPaperList', 'LoadPaper', function ($scope, $http, $compile, PreviewData, HTMLGenerator, LoadPaperList, LoadPaper) {
        $(document).ready(function () {
            PreviewData.portfolio._id = window.location.href.split("id=")[1].split('#/')[0];

            initPaper();

            LoadPaperList($http, PreviewData.portfolio._id, function (result) {
                PreviewData.paperList = result.result;
                $scope.papers = result.result;

                var paper;
                for(var idx = 0; idx < $scope.papers.length; idx++){
                    paper = $scope.papers[idx];
                    if(paper.isIndex === true){
                        PreviewData.paperId = paper._id;

                        LoadPaper($http, PreviewData.paperId, function (result) {
                            PreviewData.paper = result.result;

                            loadPaper(PreviewData.paper);
                        });
                    }
                }
            });
        });

        function initPaper(){
            $('#canvas-content').find('div').remove();

            $scope.paper = new Paper();
            PreviewData.childArr = [];

            // z index 초기화
            PreviewData.end_zOrder = 0;
            PreviewData.start_zOrder = 0;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function loadPaper(paper) {
            var paperChildArr = paper.childArr;

            $compile($('#canvas-content'))($scope); // 페이퍼 속성을 적용시켜줌.

            var child;
            for (var index = 0; index < paperChildArr.length; index++) {
                child = paperChildArr[index];
                PreviewData.childArr[child._id] = child;
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

            var templateItemArray = article.childArr;
            PreviewData.end_zOrder++;
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





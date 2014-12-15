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
    'services/LoadPaper'
], function ($, ng, app, Paper, EditorData) {
    app.controller('portfolioPreview', ['$scope', 'EditorData', 'LoadPaper', function ($scope, EditorData, HTMLGenerator, LoadPaper) {
        $(document).ready(function () {
            LoadPaper($http, EditorData.paperId, function (result) {
                EditorData.paper = result.result;

                loadPaper(EditorData.paper);
            });
        });

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
    }]);
});





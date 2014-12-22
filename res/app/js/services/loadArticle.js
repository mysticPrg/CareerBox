/**
 * Created by gimbyeongjin on 14. 11. 14..
 */

define([
    'app',
    'classes/LayoutComponents/Article',
    'services/HTMLGenerator',
    'services/EditorData'

], function(app, Article) {
    app.factory('loadArticle', function (HTMLGenerator, EditorData, $compile) {

        function loadArticle(_article, $scope) {
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


        return loadArticle;
    });

});
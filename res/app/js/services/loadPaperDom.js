/**
 * Created by gimbyeongjin on 14. 11. 14..
 */

define([
    'app',
    'classes/LayoutComponents/Article',
    'services/HTMLGenerator',
    'services/EditorData',
    'services/loadArticle'

], function(app) {
    app.factory('loadPaperDom', function (HTMLGenerator, EditorData, $compile, loadArticle) {

        function loadPaperDom(paper, $scope) {
            var paperChildArr = paper.childArr;
            $('#canvas-content').find('div').remove();
            $compile($('#canvas-content'))($scope); // 페이퍼 속성을 적용시켜줌.

            var child;
            for (var index = 0; index < paperChildArr.length; index++) {
                child = paperChildArr[index];
                EditorData.childArr[child._id] = child;
                if (child.childArr) {
                    loadArticle(child, $scope);

                } else {
                    loadItem(child, $scope);
                }
                EditorData.end_zOrder++;
            }
        }

        function loadItem(item, $scope) {
            var option = {draggable: true, resizable: true, rotatable: true};

            var domObj = HTMLGenerator('loadItem', item, item._id, option);

            $('#' + item._id).remove();
            $('#canvas-content').append(domObj);
            $compile($('#' + item._id))($scope);
        }

        return loadPaperDom;
    });

});
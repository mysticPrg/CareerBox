/**
 * Created by gimbyeongjin on 14. 11. 14..
 */

define([
    'app',
    'classes/LayoutComponents/Article',
    'service/HTMLGenerator',
    'service/EditorData',
    'service/loadArticle'

], function(app) {
    app.factory('loadPaperDom', function (HTMLGenerator, EditorData, $compile, loadArticle) {

        function loadPaperDom(paper, $scope) {
            var paperChildArr = paper.childArr;
            $('#canvas-content').find('div').remove();
            // z index 초기화
            EditorData.end_zOrder = 0;
            EditorData.start_zOrder = 0;

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

            $('#canvas-content').append($compile(domObj)($scope));
        }

        return loadPaperDom;
    });

});
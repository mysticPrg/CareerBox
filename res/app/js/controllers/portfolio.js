/**
 * Created by JEONGBORAM-PC-W1 on 2014-12-26.
 */
define([
    'jquery',
    'angular',
    'app',
    'classes/Paper',
    'service/EditorData',
    'service/HTMLGenerator',
    'service/LoadPaperList',
    'service/LoadPaper',
    'component/item/line/component',
    'component/item/shape/component',
    'component/item/text/component',
    'component/item/link/component',
    'component/item/image/component',
    'directives/CommonAttribute',
    'service/loadArticle'
], function ($, ng, app, Paper) {
    app.controller('portfolio', ['$scope', '$http', '$compile', 'EditorData', 'HTMLGenerator', 'LoadPaperList', 'LoadPaper', 'loadArticle', function ($scope, $http, $compile, EditorData, HTMLGenerator, LoadPaperList, LoadPaper, loadArticle) {
        //$scope.paper;

        $scope.paperItemArray = [];

        $(document).ready(function () {
            var params = {};
            window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) {
                params[key] = value;
            });

            EditorData.portfolio._id = params.id;
            EditorData.paper_id = params.paper_id; // 만약에 paper_id 가 없으면 index페이지로 이동.

            initPaper();

            LoadPaperList($http, EditorData.portfolio._id, function (result) {
                EditorData.paperList = result.result;
                $scope.papers = result.result;

                function loadPaperWithResult(result) {
                    EditorData.paper = result.result;
                    $scope.canvasStyle = {
                        position: 'relative',
                        width: paper.size.width + 'px',
                        margin: 'auto'
                    };
                    loadPaper(EditorData.paper);
                }

                var paper;
                for (var idx = 0; idx < $scope.papers.length; idx++) {
                    paper = $scope.papers[idx];

                    if (!EditorData.paper_id && paper.isIndex === true) {
                        EditorData.paperId = paper._id;

                        LoadPaper($http, EditorData.paperId, loadPaperWithResult);
                        return;
                    }

                    if (paper._id === EditorData.paper_id) {

                        EditorData.paperId = paper._id;

                        LoadPaper($http, EditorData.paperId, loadPaperWithResult);
                        return;
                    }
                }
            });
        });

        function initPaper() {
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

            $('title').text(paper.title);

            $compile($('#canvas-content'))($scope); // 페이퍼 속성을 적용시켜줌.

            var child;
            for (var index = 0; index < paperChildArr.length; index++) {
                child = paperChildArr[index];
                EditorData.childArr[child._id] = child;
                if (child.childArr) {
                    loadArticle(child, $scope);
                } else {
                    loadItem(child);
                }
            }
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





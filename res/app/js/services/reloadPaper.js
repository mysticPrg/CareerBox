/**
 * Created by JEONGBORAM-PC-W1 on 2014-12-23.
 */

define([
    'app',
    'services/HTMLGenerator',
    'services/EditorData',
    'services/SetAttributeInformation',
    'services/SavePaper',
    'services/LoadPaper',
    'service/loadPaperDom'
], function (app) {
    app.factory('reloadPaper', function (HTMLGenerator, EditorData, SetAttributeInformation, SavePaper, LoadPaper, $http, $compile, loadPaperDom) {
        function reloadPaper($scope, callback) {

            var paper = EditorData.paper;
            paper.childArr = getPaperChildArr(EditorData.childArr);

            //페이퍼 저장
            var data = {_portfolio_id: EditorData.portfolio._id, paper: paper};

            SavePaper($http, data, function (result) {
                if (result.returnCode === '000') {
                    // 페이퍼 로드
                    LoadPaper($http, EditorData.paperId, function (result) {
                        EditorData.paper = result.result;
                        EditorData.paperTitle = result.result.title;

                        loadPaperDom(EditorData.paper, $scope);

                        // 어트리뷰트 모델 강제 변경
                        $scope.$emit('changeAttributePanelModel');

                        callback();
                    });

                } else if (result.returnCode === '001') {
                } else if (result.returnCode === '002') {
                }
            });
        }

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

        return reloadPaper;
    });

});
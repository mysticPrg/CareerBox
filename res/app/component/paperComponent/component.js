/**
 * Created by JEONGBORAM-PC-W1 on 2014-12-01.
 */
define([
    'app',
    '../createPaperModal/component',
    '../deletePaperModal/component',
    'service/EditorData',
    'service/SavePaper',
    'service/deletePaper',
    'service/LoadPaperList'
], function (app, createPaperModal, deletePaperModal) {
    app.controller('paperComponent', [
        '$scope',
        '$http',
        '$compile',
        '$modal',
        'EditorData',
        'SavePaper',
        'deletePaper',
        'LoadPaperList',
        function ($scope, $http, $compile, $modal, EditorData, SavePaper, deletePaper, LoadPaperList) {
            $scope.paperTitle = 'Select Paper';
            $scope.papers = [];

            function loadPaperList(){
                LoadPaperList($http, EditorData.portfolio._id, function (result) {
                    EditorData.paperList = result.result;
                    $scope.papers = result.result;

                    if(EditorData.paperId === '') {
                        var paper;
                        for (var idx = 0; idx < $scope.papers.length; idx++) {
                            paper = $scope.papers[idx];
                            if (paper.isIndex === true) {
                                EditorData.paperId = paper._id;
                                EditorData.paperTitle = paper.title;
                            }
                        }
                    }else{
                        for (var idx = 0; idx < $scope.papers.length; idx++) {
                            paper = $scope.papers[idx];
                            if (paper._id === EditorData.paperId) {
                                EditorData.paperId = paper._id;
                                EditorData.paperTitle = paper.title;
                            }
                        }
                    }

                    $scope.paperTitle = EditorData.paperTitle;
                });
            }

            $(document).ready(function () {
                loadPaperList();
            });

            $scope.createPaper = function (paper){
                var data = {_portfolio_id: EditorData.portfolio._id, paper: paper};

                SavePaper($http, data, function (result) {
                    if(result.returnCode === '000'){
                        EditorData.paperId = result.result;
                        loadPaperList();
                    }
                });
            }

            $scope.changePage = function (id, title){
                EditorData.paperId = id;
                $scope.paperTitle = title;

                // 속성창 갱신 First Task
                EditorData.focusId = EditorData.paperId;
            }

            $scope.popCreatePaperModal = function () {
                var modalInstance = $modal.open(createPaperModal);
                modalInstance.result.then(function (paper) {
                    $scope.createPaper(paper);
                }, function () {
                });
            };

            $scope.popDeletePaperModal = function (id){
                var modalInstance = $modal.open(deletePaperModal);
                modalInstance.result.then(function () {
                    var data = {_id: id};

                    deletePaper($http, data, function(result){
                        $scope.paperTitle = 'Select Paper';
                        loadPaperList();
                        window.location.reload();
                    });
                }, function () {
                });
            }
        }
    ]);

    app.directive('paperComponent', function () {
        return {
            restrict: 'A',
            templateUrl: require.toUrl('component/paperComponent/template.html'),
            controller: 'paperComponent'
        };
    });

});

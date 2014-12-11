/**
 * Created by JEONGBORAM-PC-W1 on 2014-12-01.
 */
define([
    'app',
    '../createPaperModal/component',
    '../deletePaperModal/component',
    'services/EditorData',
    'services/SavePaper',
    'services/deletePaper',
    'services/LoadPaperList'
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

            $(document).ready(function () {

            });

            $scope.createPaper = function (paper){
                var data = {_portfolio_id: EditorData.portfolio._id, paper: paper};

                SavePaper($http, data, function (result) {
                    if(result.returnCode === '000'){
                        $scope.loadPaperList();
                        EditorData.paperId = result.result;
                        $scope.paperTitle = paper.title;
                    }
                });
            }

            $scope.loadPaperList = function (){
                LoadPaperList($http, EditorData.portfolio._id, function (result) {
                    EditorData.paperList = result.result;
                    $scope.papers = result.result;

                    if(EditorData.paperId === ''){
                        EditorData.paperId = EditorData.paperList[0]._id;
                        $scope.paperTitle = $scope.papers[0].title;
                    }
                });
            }

            $scope.changePage = function (id, title){
                EditorData.paperId = id;
                $scope.paperTitle = title;
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
//                        console.log(result);
                        $scope.paperTitle = 'Select Paper';
                        $scope.loadPaperList();
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

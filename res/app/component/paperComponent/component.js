/**
 * Created by JEONGBORAM-PC-W1 on 2014-12-01.
 */
define([
    'app',
    'services/EditorData',
    'services/LoadPaperList'
], function (app) {
    app.controller('paperComponent', [
        '$scope',
        '$http',
        '$compile',
        'EditorData',
        'LoadPaperList',
        function ($scope, $http, $compile, EditorData, LoadPaperList) {
            $scope.paperTitle = '';
            $scope.papers;

            $(document).ready(function () {
                LoadPaperList($http, EditorData.portfolio._id, function (result) {
                    EditorData.paperList = result.result;
                    $scope.papers = result.result;

                    if(EditorData.paperId === ''){
                        EditorData.paperId = EditorData.paperList[0]._id;
                    }

                    // get selected paper title
                    for(var idx = 0; idx < $scope.papers.length; idx++){
                        if(EditorData.paperId === $scope.papers[idx]._id){
                            $scope.paperTitle = $scope.papers[idx].title;
                        }
                    }
                });
            });
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

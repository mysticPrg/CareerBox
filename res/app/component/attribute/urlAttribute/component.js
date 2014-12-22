
define([
    'app',
    'service/EditorData'
], function (app) {

    app.directive('urlAttribute', function (EditorData) {
        return {
            restrict: 'A',
            scope: {
                data : "=to"
            },
            link: function ($scope, element, att) {

                $scope.papers = {};
                for(var i in EditorData.paperList){
                    var key = EditorData.paperList[i]._id;
                    var value = EditorData.paperList[i].title;
                    $scope.papers[key] = value;
                }

//                function getTitle(){
//                    for(var i in EditorData.paperList){
//                        var key = EditorData.paperList[i]._id;
//                        var value = EditorData.paperList[i].title;
//                        $scope.papers[key] = value;
//
//                        // 내부링크 판별
//                        if(EditorData.paperList[i]._id === EditorData.paper._id){
//                            $scope.url_defalt = $scope.papers[EditorData.paper._id];
//                            console.log('$scope.url_title', $scope.url_defalt);
//                            return;
//                        }
//                    }
//                }
//
//                getTitle();

                $scope.setURL = function() {
                    for(var key in $scope.papers){
                        if($scope.papers[key] == $scope.url_title){
                            $scope.data.url = key;
                        }
                    }
                }
            },
            templateUrl: require.toUrl('component/attribute/urlAttribute/template.html')
        };
    });

});
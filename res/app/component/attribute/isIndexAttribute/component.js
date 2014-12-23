
define([
    'app',
    'service/SetIndex',
    'service/EditorData'
], function (app) {

    app.directive('isIndexAttribute', function (SetIndex, EditorData) {

        return {
            restrict: 'A',
            scope: {
                data : "=to"
            },
            templateUrl: require.toUrl('component/attribute/isIndexAttribute/template.html'),
            link: function ($scope, element, att) {

                $scope.isIndex = $scope.data.isIndex;

                $scope.check = function(){
                    if($scope.isIndex == true){
                        $scope.data.isIndex = $scope.isIndex
                        var data = {
                            _portfolio_id : EditorData.portfolio._id,
                            _paper_id : EditorData.paperId
                        }
                        SetIndex(data, function() {
                            alert("현재 페이지가 Index 페이지로 되었습니다.")
                        });
                    }
                };
            }
        };
    });

});

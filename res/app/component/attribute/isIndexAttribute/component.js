
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
            link: function ($scope) {

                $scope.$watch('data._id', function() {
                    $scope.isIndex = $scope.data.isIndex;
                });

                $scope.check = function(){
                    if($scope.isIndex === true){
                        $scope.data.isIndex = $scope.isIndex;
                        var data = {
                            _portfolio_id : EditorData.portfolio._id,
                            _paper_id : EditorData.paperId
                        };

                        SetIndex(data, function() {});
                    } else {
                        $scope.isIndex = true;
                    }
                };
            }
        };
    });

});

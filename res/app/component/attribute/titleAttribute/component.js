
define([
    'app',
    'service/EditorData'

], function (app) {

    app.directive('titleAttribute', function (EditorData) {
        return {
            restrict: 'A',
            scope: {
                data : "=to"
            },
            templateUrl: require.toUrl('component/attribute/titleAttribute/template.html'),
            link : function($scope, element, att){
                // 예외처리
                if((window.location.href.indexOf('TemplateEditor') >= 0 && att.id === 'canvas-content')){
                    $scope.data.title = $scope.EditorData = EditorData.template.title;
                }
            }
        };
    });

});
/**
 * Created by JEONGBORAM-PC-W1 on 2014-11-17.
 */
define([
    'angular',
    'app',
    'controllers/paperEditor',
    'controllers/templateEditor'
], function (ng, app) {
    app.config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider
                .when('/PaperEditor', {
                    templateUrl: 'paperEditor.html',
                    controller: 'PaperEditorController'
                })
//                .when('/SectionEditor', {
//                    templateUrl: 'sectionEditor.html',
//                    controller: 'SectionEditorController'
//                })
                .when('/TemplateEditor', {
                    templateUrl: 'templateEditor.html',
                    controller: 'TemplateEditor'
                })
                .otherwise({
                    redirectTo: '/PaperEditor'
                });
        }]);
});
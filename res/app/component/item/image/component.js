define([
    'app',
    'jquery-ui',
    'service/SetAttributeInformation',
    'service/serverURL'
], function (app) {


    app.directive('image', ['SetAttributeInformation', 'serverURL', function (SetAttributeInformation, serverURL) {
        return {
            // A = attribute, E = Element, C = Class and M = HTML Comment

            restrict: 'A',
            scope: true,   // 새로운 스코프
            link: function (scope, element, att) {
                scope.serverURL = serverURL;
                scope.info = SetAttributeInformation(att.id).attributeInformation;

                scope.$watch('info.radius', function () {
                    scope.radius = {
                        'border-radius': scope.info.radius + "px"
                    };
                });

            },

            templateUrl: require.toUrl('component/item/image/template.html')
        };
    }]);
});
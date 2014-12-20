define([
    'app',
    'jquery-ui',
    'services/SetAttributeInformation'
], function (app) {


    app.directive('image', ['SetAttributeInformation', function (SetAttributeInformation) {
        return {
            // A = attribute, E = Element, C = Class and M = HTML Comment

            restrict: 'A',
            scope : true,   // 새로운 스코프
            link: function(scope, element, att) {
                scope.info = SetAttributeInformation(att.id).attributeInformation;

            },

        templateUrl: require.toUrl('component/item/image/template.html')
        };
    }]);
});
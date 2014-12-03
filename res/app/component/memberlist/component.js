define(['app', 'services/memberlist'], function (app) {

    app.directive('memberlist', function (memberlist) {
        return {
            restrict: 'E',
            templateUrl: require.toUrl('component/memberlist/template.html'),
            link: function (scope, elem, attr) {
                memberlist.success(function(data) {
                    scope.memberlist = data.result;
                });
            }
        };
    });

});
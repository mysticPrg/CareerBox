
define([
    'app'
], function (app) {
//    this.arrow = new Arrow();
//    function Arrow() {
//        this.use = false;
//        this.direction = Direction.end;
//                var Direction = {
//                    start: 'start',
//                    end: 'end',
//                    both: 'both'
//                };
//    };

//    this.pos_start = new Position();
//    this.pos_end = new Position();

    app.directive('arrowAttribute', function () {
        return {
            restrict: 'A',
            scope: {
                data : "=to"
            },
            templateUrl: require.toUrl('component/attribute/arrowAttribute/template.html'),
            controller: function ($scope, $rootScope) {
            }
        };
    });

});
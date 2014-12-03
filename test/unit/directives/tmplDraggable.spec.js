/*global describe beforeEach it expect */
'use strict';
define([
    'angularMocks', // 반드시 주입해주어야함.
    'directives/tmplDraggable'

], function() {

    describe('tmplDraggable', function() {
        var $compile, $rootScope;

        beforeEach(module('myApp'));

        beforeEach(inject(
            ['$compile','$rootScope', function($c, $r) {
                $compile = $c;
                $rootScope = $r;
            }]
        ));

        it("should display the welcome text properly", function() {
            var element = $compile('<div tmpl-draggable>User</div>')($rootScope);
            expect(element.html()).toEqual('User');
        })

    });
});

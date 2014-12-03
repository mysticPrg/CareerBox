/*global describe beforeEach it expect */

define([
    'services/httpJoin',
    'angularMocks' // 반드시 주입해주어야함.
], function() {
    'use strict';

    describe('httpJoin', function() {

        beforeEach(module('myApp'));

        it('should contain an httpJoin service',
            inject(['$injector',function($injector) {
                var httpJoin = $injector.get('httpJoin');
                expect(httpJoin).not.toEqual(null);

            }])
        );

    });

});
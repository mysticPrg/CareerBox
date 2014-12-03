/*global describe beforeEach it expect */

define([
    'services/httpLogin',
    'angularMocks' // 반드시 주입해주어야함.
], function() {
    'use strict';

    describe('httpLogin', function(){

        beforeEach(module('myApp'));

        it('should contain an httpLogin service',
            inject(['$injector',function($injector) {
                var httpLogin = $injector.get('httpLogin');
                expect(httpLogin).not.toEqual(null);

            }])
        );

    });

});
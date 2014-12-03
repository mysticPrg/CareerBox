/**
 * Created by gimbyeongjin on 14. 11. 11..
 */

define([
    'services/createPortfolio',
    'angularMocks' // 반드시 주입해주어야함.
], function() {
    'use strict';

    describe('createPortfolio', function() {

        beforeEach(module('myApp'));

        it('should contain an createPortfolio service',
            inject(['$injector',function($injector) {
                var createPortfolio = $injector.get('createPortfolio');
                expect(createPortfolio).not.toEqual(null);

            }])
        );

    });

});
/*global describe beforeEach it expect */

define([
    'services/memberCallback',
    'angularMocks' // 반드시 주입해주어야함.
], function() {
    'use strict';

    describe('memberCallback', function() {

        var memberCallback, rootScope, data = {};

        var $window;

        beforeEach(module('myApp'));

        beforeEach(function(){
            $window = {location: {}};

            module(function($provide) {
                $provide.value('$window', $window);
            });

            inject(function($injector, $rootScope) {
                memberCallback = $injector.get('memberCallback');
                rootScope = $rootScope;
            });

            // 컨트롤러 상의 설정
            rootScope.msgs = [];
            rootScope.msgs.splice(0, rootScope.msgs.length);
        });

        it('should contain an memberCallback service',function() {
            expect(memberCallback).not.toEqual(null);
        });

        it('에러 발생 케이스',function() {

            data.returnCode = 'error';

            memberCallback($window, rootScope, data);
            expect(rootScope.msgs).toEqual(["서버와의 연결이 되지 않았습니다."]);
        });

        it('성공 케이스',function() {

            data.returnCode = '000'

            var href = "editor.html";
            memberCallback($window, rootScope, data, href);

            expect(rootScope.msgs).toEqual(["성공하였습니다."]);

            // 페이지 이동 확인
            expect($window.location.href).toBe('editor.html');
        });

        it('오류 케이스',function() {

            data.returnCode = '001'

            memberCallback($window, rootScope, data);
            expect(rootScope.msgs).toEqual(["오류 발생"]);
        });

        it('로그인 안된 케이스',function() {

            data.returnCode = '002'

            memberCallback($window, rootScope, data);
            expect(rootScope.msgs).toEqual(["로그인이 안되어있습니다."]);
        });

        it('잘못된 형식의 아이디이거나 패스워드입니다 케이스',function() {

            data.returnCode = '101'

            memberCallback($window, rootScope, data);
            expect(rootScope.msgs).toEqual(["잘못된 형식의 아이디이거나 패스워드입니다."]);
        });

        it('이미 존재하는 이메일입니다 케이스',function() {

            data.returnCode = '102'

            memberCallback($window, rootScope, data);
            expect(rootScope.msgs).toEqual(["이미 존재하는 이메일입니다."]);
        });

    });

});
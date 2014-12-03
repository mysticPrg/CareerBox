/*global describe beforeEach it expect */

define([
    'angularMocks', // 반드시 주입해주어야함.
    'controllers/joinController'
], function() {
    'use strict';

    describe('joinController', function(){
        var joinController, scope, httpBackend, RequestHandler;

        beforeEach(module('myApp'));

        beforeEach(inject(['$rootScope', '$controller','$httpBackend', function($rootScope, $controller, $httpBackend) {
            scope = $rootScope.$new();
            joinController = $controller('joinController', {
                $scope: scope
            });

            // 페이커 응답
            httpBackend = $httpBackend;
            RequestHandler = $httpBackend.when('POST', 'http://210.118.74.166:8123/member/join',{ 'email': 'kbj7353@naver.com', 'password': '123456' })
                .respond({returnCode: '000'});    // 요청과 응답은 $httpBackend의 expectPOST 메서드를 이용하여 언제든지 수정, 추가할 수 있음.

        }]));

        afterEach(function() {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('joinController 컨트롤러가 있는가?', function() {
            expect(joinController).not.toEqual(null);
        });

        it('$scope.errors', function() {
            expect(scope.errors).not.toEqual(null);
        });

        it('$scope.msgs', function() {
            expect(scope.msgs).not.toEqual(null);
        });

        it('$scope.join 성공 테스트', function() {
            // 함수 존재 여부 검사
            expect(scope.join).not.toEqual(null);

            // 콜백함수 존재 여부 검사
            expect(scope.callback).not.toEqual(null);
        });

        it('패스워드 불일치 테스트', function() {

            // 파라미터 테스트 케이스 설정
            scope.userEmail = 'kbj7353@naver.com'
            scope.userPassword = '123456'
            scope.userPasswordReconfirm = '123123'  // 불일치

            scope.join();

            expect(scope.msgs).toEqual(["패스워드를 다시 확인해주세요."]);
        });

        it('join 성공 테스트', function() {

            // 페이커 응답 설정 : 성공 리턴 코드를 반환하는 케이스
            httpBackend.expectPOST('http://210.118.74.166:8123/member/join',{ 'email': 'kbj7353@naver.com', 'password': '123456' })
                .respond({returnCode: '000'});

            // 파라미터 테스트 케이스 설정
            scope.userEmail = 'kbj7353@naver.com'
            scope.userPassword = '123456'
            scope.userPasswordReconfirm = '123456'

            // 콜백 함수 등록
            scope.callback = function(data) {
                expect(data.returnCode).toEqual('000'); // 성공해야함.
            };

            // request 시작
            scope.join();

            // response 호출
            httpBackend.flush();

        });

        it('join 실패 테스트', function() {

            // 페이커 응답 설정 : 실패 리턴 코드를 반환하는 케이스
            httpBackend.expectPOST('http://210.118.74.166:8123/member/join',{ 'email': 'kbj2043@naver.com', 'password': '123456' })
                .respond({returnCode: '001'});

            // 파라미터 테스트 케이스 설정
            scope.userEmail = 'kbj2043@naver.com'
            scope.userPassword = '123456'
            scope.userPasswordReconfirm = '123456'

            // 콜백 함수 등록
            scope.callback = function(data) {
                expect(data.returnCode).toEqual('001'); // 실패해야함.
            };

            // request 시작
            scope.join();

            // response 호출
            httpBackend.flush();

        });

    });

});
/*global describe beforeEach it expect */

define([
    'angularMocks', // 반드시 주입해주어야함.
    'controllers/editorController'
], function() {
    'use strict';

    describe('editorController', function(){
        var editorController, scope, httpBackend, RequestHandler;

        beforeEach(module('myApp'));

        beforeEach(inject(['$rootScope', '$controller','$httpBackend', function($rootScope, $controller, $httpBackend) {
            scope = $rootScope.$new();
            editorController = $controller('editorController', {
                $scope: scope
            });

            // 페이커 응답
            httpBackend = $httpBackend;
            RequestHandler = $httpBackend.when('GET', 'http://210.118.74.166:8123/member/paper')
                .respond({returnCode: '000'});    // 요청과 응답은 $httpBackend의 expectPOST 메서드를 이용하여 언제든지 수정, 추가할 수 있음.

        }]));

//        afterEach(function() {
//            httpBackend.verifyNoOutstandingExpectation();
//            httpBackend.verifyNoOutstandingRequest();
//        });

        it('editorController 컨트롤러가 있는가?', function() {
            expect(editorController).not.toEqual(null);
        });

        it('$scope.errors', function() {
            expect(scope.errors).not.toEqual(null);
        });

        it('$scope.msgs', function() {
            expect(scope.msgs).not.toEqual(null);
        });

        it('$scope.logout 성공 테스트', function() {
            // 함수 존재 여부 검사
            expect(scope.logout).not.toEqual(null);

            // 콜백함수 존재 여부 검사
            expect(scope.callback).not.toEqual(null);
        });

        it('logout 성공 테스트', function() {

            // 페이커 응답 설정 : 성공 리턴 코드를 반환하는 케이스
            httpBackend.expectGET('http://210.118.74.166:8123/member/logout')
                .respond({returnCode: '000'});

            // 콜백 함수 등록
            scope.callback = function(data) {
                expect(data.returnCode).toEqual('000'); // 성공해야함.
            };

            // request 시작
            scope.logout();

            // response 호출
//            httpBackend.flush();

        });

        it('logout 실패 테스트', function() {

            // 페이커 응답 설정 : 실패 리턴 코드를 반환하는 케이스
            httpBackend.expectGET('http://210.118.74.166:8123/member/logout')
                .respond({returnCode: '001'});

            // 콜백 함수 등록
            scope.callback = function(data) {
                expect(data.returnCode).toEqual('001'); // 실패해야함.
            };

            // request 시작
            scope.logout();

            // response 호출
//            httpBackend.flush();

        });

    });

});
/**
* Created by gimbyeongjin on 14. 11. 11..
*/

define([
    'angularMocks', // 반드시 주입해주어야함.
    'component/newPortfolio/component'
], function() {
    'use strict';

    describe('newPortfolioController', function(){
        var newPortfolioController, scope, httpBackend, RequestHandler;

        beforeEach(module('myApp'));

        beforeEach(inject(['$rootScope', '$controller','$httpBackend', function($rootScope, $controller, $httpBackend) {
            scope = $rootScope.$new();
            newPortfolioController = $controller('newPortfolioController', {
                $scope: scope
            });

            // 페이커 응답
            httpBackend = $httpBackend;
            RequestHandler = $httpBackend.when('GET', 'http://210.118.74.166:8123/portfolio')
                .respond({returnCode: '000'});    // 요청과 응답은 $httpBackend의 expectPOST 메서드를 이용하여 언제든지 수정, 추가할 수 있음.

        }]));

//페이지가 다 로딩된 시점에서 시작


//리스폰스 성공 확인 시 목록 변수에 추가

        it('newPortfolioController 컨트롤러가 있는가?', function() {
            expect(newPortfolioController).not.toEqual(null);
        });

        //비어있는 목록 변수 생성
        it('$scope.portfolios', function() {
            expect(scope.portfolios).not.toEqual(null);
        });

        it('$scope.getPortfolioList', function() {
            // 함수 존재 여부 검사
            expect(scope.getPortfolioList).not.toEqual(null);

        });

        it('$scope.callback', function() {
            // 함수 존재 여부 검사
            expect(scope.callback).not.toEqual(null);
        });

        //페이지 목록 받아오기
        it('페이지 목록 받아오기 : 성공', function() {

            // 페이커 응답 설정 : 성공 리턴 코드를 반환하는 케이스
            httpBackend.expectGET('http://210.118.74.166:8123/portfolio')
                .respond({returnCode: '000'});

            // 콜백 함수 등록
            scope.callback = function(data) {
                expect(data.returnCode).toEqual('000'); // 성공해야함.
            };

            // request 시작
            scope.getPortfolioList();

            // response 호출
            httpBackend.flush();
        });

        it('페이지 목록 받아오기 : 실패', function() {

            // 페이커 응답 설정 : 성공 리턴 코드를 반환하는 케이스
            httpBackend.expectGET('http://210.118.74.166:8123/portfolio')
                .respond({returnCode: '001'});

            // 콜백 함수 등록
            scope.callback = function(data) {
                expect(data.returnCode).toEqual('001'); // 실패해야함.
            };

            // request 시작
            scope.getPortfolioList();

            // response 호출
            httpBackend.flush();

        });

    });

});
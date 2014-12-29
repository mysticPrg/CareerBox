define([
    'jquery',
    'angular',
    'app',
    'service/EditorData',
    'service/httpLogout',
    'service/SetAttributeInformation',
    '../route',
    'component/attributePanel/component',
    'component/item/line/component',
    'component/item/shape/component',
    'component/item/text/component',
    'component/item/link/component',
    'component/item/image/component',
    'directives/CommonAttribute'
], function ($, ng, app) {
    app.controller('portfolioEditor', ['$scope', '$compile', '$window', 'EditorData', 'httpLogout', 'SetAttributeInformation',
        function ($scope, $compile, $window, EditorData, httpLogout, SetAttributeInformation) {

            $(document).ready(function () {
                EditorData.portfolio._id = window.location.href.split("id=")[1].split('#/')[0];

                $scope.templates = [];

                $scope.orientation = "horizontal";
                $scope.panes = [
                    {collapsible: false, scrollable: false},
                    {collapsible: true, size: "300px" }
                ];

                // 방향키로 item 움직이도록 처리
                $(document).on('keydown', function (e) {
                    var result = true;
                    if (EditorData.focusId === 'canvas-content' || EditorData.focusInput === true) {
                        return result;
                    }

                    var focusObejct = SetAttributeInformation(EditorData.focusId).attributeInformation;

                    var direction, value;
                    switch (e.keyCode) {
                        case 38:
                            focusObejct.pos.y -= 5;
                            if (focusObejct.pos.y < 0) {
                                focusObejct.pos.y = 0;
                            }
                            direction = 'top';
                            value = focusObejct.pos.y;
                            result = false;
                            break;
                        case 40:
                            focusObejct.pos.y += 5;
                            if (focusObejct.pos.y + focusObejct.size.height > EditorData.paper.size.height) {
                                focusObejct.pos.y = EditorData.paper.size.height - focusObejct.size.height;
                            }
                            direction = 'top';
                            value = focusObejct.pos.y;
                            result = false;
                            break;
                        case 37:
                            focusObejct.pos.x -= 5;
                            if (focusObejct.pos.x < 0) {
                                focusObejct.pos.x = 0;
                            }
                            direction = 'left';
                            value = focusObejct.pos.x;
                            result = false;
                            break;
                        case 39:
                            focusObejct.pos.x += 5;
                            if (focusObejct.pos.x + focusObejct.size.width > EditorData.paper.size.width) {
                                focusObejct.pos.x = EditorData.paper.size.width - focusObejct.size.width;
                            }
                            direction = 'left';
                            value = focusObejct.pos.x;
                            result = false;
                            break;
                    }

                    $('#' + EditorData.focusId).css(direction, value + 'px');
                    $compile('#posAttribute')($scope);
                    return result;
                });

                // input이 선택되면 focusInput = true;
                $(document).on('mousedown', function (e) {
                    if (isFocusInput(e.target)) {
                        EditorData.focusInput = true;
                    } else {
                        EditorData.focusInput = false;
                    }

                    return true;
                });

                function isFocusInput(target) {
                    var targetTagName = target.tagName;
                    if ((targetTagName === 'INPUT') || (targetTagName === 'TEXTAREA')) {
                        return true;
                    } else {
                        return false;
                    }
                }

                $scope.hrefPreview = function () {
                    $window.location.href = 'portfolioPreview.html?id=' + EditorData.portfolio._id;
                };

                $scope.hrefManager = function () {
                    $window.location.href = 'portfolioManager.html';
                };

                $scope.logout = function () {
                    httpLogout(function (data) {
                        if (data.returnCode === '000') {
                            //
                            $window.location.href = 'index.html';
                        }
                    });
                };

                $scope.goToPortfolio = function () {
                    var href = 'portfolioPreview.html?id=' + EditorData.portfolio._id;
                    $window.open(href);
                };

            });


        }]);

});




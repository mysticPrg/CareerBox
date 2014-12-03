/**
 * Created by gimbyeongjin on 14. 10. 18..
 */

define([
    'app',
    'jquery-ui',
    'services/EditorData',
    'services/ApplyCommonItemAttribute',
    'services/SetAttributeInformation'
], function (app) {
    app.directive('draggable', ['$compile', 'EditorData', 'ApplyCommonItemAttribute', 'SetAttributeInformation', function ($compile, EditorData, ApplyCommonItemAttribute, SetAttributeInformation) {
        return {

            // A = attribute, E = Element, C = Class and M = HTML Comment
            restrict: 'A',
            scope : true,   // 새로운 스코프
            //The link function is responsible for registering DOM listeners as well as updating the DOM.
            link: function (scope, element, att) {
                element.draggable({
                    helper: 'original',    // 객체를 복사
                    cursor: 'move',     //
                    tolerance: 'fit',   //
                    containment: '#canvas-content'    // 드롭되지 않으면 다시 돌아옴.
                });

                element.bind('mousedown', function (){
                    // 포커싱 처리
                    EditorData.focusId = att.id;
                    element.trigger('click');   // 없으면 이벤트가 씹힘... 왜 그런지는 모르겟음.
                });

                element.bind('mouseup', function (){
                    // 위치 업데이트
                    var item = SetAttributeInformation(att.id);
                    item.pos = {x: element.position().left, y: element.position().top};

                    if (item.state != 'new') {
                        item.state = 'edit';
                    }
                    element.trigger('click');   // 없으면 이벤트가 씹힘... 왜 그런지는 모르겟음.
                });

//                scope.attributeInformation = SetAttributeInformation(att.id);
//
//                if(scope.attributeInformation.itemType!='Line'){   // 라인은 제외
//                    // fill 리스너 달기
//                    scope.$watch("attributeInformation.fill",function() {
//                        if(EditorData.focusId == att.id)
//                            ApplyCommonItemAttribute.fill(element, scope.attributeInformation);
//                    },true);
//
//                    // outline 색
//                    scope.$watch("attributeInformation.outline",function() {
//                        if(EditorData.focusId == att.id)
//                            ApplyCommonItemAttribute.outline(element, scope.attributeInformation);
//                    },true);
//
//                    // radius
//                    scope.$watch("attributeInformation.radius",function() {
//                        if(EditorData.focusId == att.id)
//                            ApplyCommonItemAttribute.radius(element, scope.attributeInformation);
//                    },true);
//
//                    // alpha 리스너 달기
//                    scope.$watch("attributeInformation.alpha",function() {
//                        if(EditorData.focusId == att.id)
//                            ApplyCommonItemAttribute.alpha(element, scope.attributeInformation);
//                    },true);
//
//                }
//                // rotate
//                scope.$watch("attributeInformation.rotate",function() {
//                    if(EditorData.focusId == att.id)
//                        ApplyCommonItemAttribute.rotate(element, scope.attributeInformation);
//                },true);
//
//                // pos
//                scope.$watch("attributeInformation.pos",function() {
//                    if(EditorData.focusId == att.id)
//                        ApplyCommonItemAttribute.pos(element, scope.attributeInformation);
//                },true);
//
//                // size
//                scope.$watch("attributeInformation.size",function() {
//                    if(EditorData.focusId == att.id)
//                        ApplyCommonItemAttribute.size(element, scope.attributeInformation);
//                },true);
            }
        };
    }]);
});

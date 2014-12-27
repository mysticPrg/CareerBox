/**
 * Created by gimbyeongjin on 14. 10. 18..
 */

define([
    'app',
    'jquery',
    'jquery-ui',
    'service/EditorData',
    'service/ApplyCommonItemAttribute',
    'service/SetAttributeInformation'
], function (app, $) {
    app.directive('draggable', ['$compile', 'EditorData', 'ApplyCommonItemAttribute', 'SetAttributeInformation', function ($compile, EditorData, ApplyCommonItemAttribute, SetAttributeInformation) {
        return {

            // A = attribute, E = Element, C = Class and M = HTML Comment
            restrict: 'A',
            scope : true,   // 새로운 스코프
            //The link function is responsible for registering DOM listeners as well as updating the DOM.
            link: function (scope, element, att) {
                var item = SetAttributeInformation(att.id).attributeInformation;
                element.draggable({
                    helper: 'original',    // 객체를 복사
                    cursor: 'move',     //
                    tolerance: 'fit',   //
                    containment: '#canvas-content',    // 드롭되지 않으면 다시 돌아옴.
                    start: function() {
//                        console.log('start', element.position());
//                        console.log('start top, left', element[0].offsetTop, element[0].offsetLeft);
                    }
                });

                element.bind('mousedown', function (){
                    // 포커싱 처리
                    EditorData.focusId = att.id;

                });

                element.bind('mouseup', function (){
                    // 위치 업데이트
//                    item.pos = {x: element.position().left, y: element.position().top};
                    item.pos = {x: element[0].offsetLeft, y: element[0].offsetTop};
                    if (item.state !== 'new') {
                        item.state = 'edit';
                    }
                    element.trigger('click');
                });

//                element.bind('mousemove', function (event){
////                    console.log('mousemove', element.position());
//                });

                element.bind('mouseout', function (){
                    $('#canvas-content').bind('click', function (){
                        // 포커싱 처리
                        EditorData.focusId = 'canvas-content';
                    });
                });

                element.bind('mouseover', function (){
                    $('#canvas-content').unbind('click');
                });
            }
        };
    }]);
});

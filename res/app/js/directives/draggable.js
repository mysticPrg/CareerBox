/**
 * Created by gimbyeongjin on 14. 10. 18..
 */

define([
    'app',
    'jquery',
    'jquery-ui',
    'services/EditorData',
    'services/ApplyCommonItemAttribute',
    'services/SetAttributeInformation'
], function (app, $) {
    app.directive('draggable', ['$compile', 'EditorData', 'ApplyCommonItemAttribute', 'SetAttributeInformation', '$document', function ($compile, EditorData, ApplyCommonItemAttribute, SetAttributeInformation, $document) {
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

                element.bind('mousedown', function (event){
                    // 포커싱 처리
                    EditorData.focusId = att.id;
                });

                element.bind('mouseup', function (event){
                    // 위치 업데이트
                    var item = SetAttributeInformation(att.id).attributeInformation;
                    item.pos = {x: element.position().left, y: element.position().top};
                    if (item.state != 'new') {
                        item.state = 'edit';
                    }
                    element.trigger('click');
                });

                element.bind('mouseout', function (event){
                    $('#canvas-content').bind('click', function (event){
                        // 포커싱 처리
                        EditorData.focusId = 'canvas-content';
                    });
                });

                element.bind('mouseover', function (event){
                    $('#canvas-content').unbind('click');
                });
            }
        };
    }]);
});

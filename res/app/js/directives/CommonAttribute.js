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
    app.directive('commonAttribute', ['$compile', 'EditorData', 'ApplyCommonItemAttribute', 'SetAttributeInformation', function ($compile, EditorData, ApplyCommonItemAttribute, SetAttributeInformation) {
        function zOrderWatch(scope, element, att){
//            if(scope.type != 'acticle_item')
            {
                scope.$watch("attributeInformation.zOrder", function () {
                    if(scope.attributeInformation._id == att.id)
                        ApplyCommonItemAttribute.zOrder(element, scope.attributeInformation);
                }, true);
            }
        };

        function setCommonWatch(scope, element, att) {
            // pos
            scope.$watch("attributeInformation.pos",function() {
                if(EditorData.focusId == att.id){
                    ApplyCommonItemAttribute.pos(element, scope.attributeInformation);
                }
            },true);

            // size
            scope.$watch("attributeInformation.size",function() {
                if(EditorData.focusId == att.id)
                    ApplyCommonItemAttribute.size(element, scope.attributeInformation);
            },true);

        };

        function setItemWatch(scope, element, att) {
            // 라인은 제외
            if(scope.attributeInformation.itemType!='line'){
                // fill 리스너 달기
                scope.$watch("attributeInformation.fill",function() {
                    if(EditorData.focusId == att.id)
                        ApplyCommonItemAttribute.fill(element, scope.attributeInformation);
                },true);

                // outline 색
                scope.$watch("attributeInformation.outline",function() {
                    if(EditorData.focusId == att.id)
                        ApplyCommonItemAttribute.outline(element, scope.attributeInformation);
                },true);

                // radius
                scope.$watch("attributeInformation.radius",function() {
                    if(EditorData.focusId == att.id)
                        ApplyCommonItemAttribute.radius(element, scope.attributeInformation);
                },true);

                // alpha 리스너 달기
                scope.$watch("attributeInformation.alpha",function() {
                    if(EditorData.focusId == att.id)
                        ApplyCommonItemAttribute.alpha(element, scope.attributeInformation);
                },true);

            };
            // rotate
            scope.$watch("attributeInformation.rotate",function() {
                if(EditorData.focusId == att.id)
                    ApplyCommonItemAttribute.rotate(element, scope.attributeInformation);
            },true);
        };

        return {

            // A = attribute, E = Element, C = Class and M = HTML Comment
            restrict: 'A',
            scope : true,   // 새로운 스코프
            //The link function is responsible for registering DOM listeners as well as updating the DOM.
            link: function (scope, element, att) {

                // 모델 GET
                var info = SetAttributeInformation(att.id);
                scope.attributeInformation = info.attributeInformation;
                scope.type = info.type;

                console.log('EditorData', EditorData);

                // z index

                if(scope.type != 'acticle_item'){
                    if(EditorData.end_zOrder == null){
                        EditorData.end_zOrder = 0;
                    } else {
                        EditorData.end_zOrder++;
                    };
                    scope.attributeInformation.zOrder = EditorData.end_zOrder;
                } else {
                    // 아티클 아이템일 경우
                    console.log('scope.attributeInformation.zOrder', scope.attributeInformation.zOrder);
                    console.log('scope.attributeInformation.itemType', scope.attributeInformation.itemType);
                }


                // 아티클, 아이템 공통
                setCommonWatch(scope, element, att);
                if('itemType' in scope.attributeInformation){
                    ApplyCommonItemAttribute.all(element, scope.attributeInformation);
                    setItemWatch(scope, element, att);
                };
                // z 인덱스
                zOrderWatch(scope, element, att);


            }
        };
    }]);
});

define([
    'app', 'jquery-ui', 'service/SetAttributeInformation'
], function (app) {
    app.directive('resizable', function (SetAttributeInformation, $compile) {

        return {
            // A = attribute, E = Element, C = Class and M = HTML Comment

            restrict:'A',
            link: function(scope, element, att) {
                var item = SetAttributeInformation(att.id).attributeInformation;

                // 캔버스
                if(att.id === 'canvas-content'){
                    element.resizable(
                        {
                            handles: "n, e, s, w, nw, ne, sw,se"
                        }
                    );
                }
                else{
                    element.resizable(
                        {
                            containment: '#canvas-content',
                            handles: "n, e, s, w, nw, ne, sw,se"
                        }
                    );
                }

                element.bind('mousedown', function (){
                    var item = SetAttributeInformation(att.id).attributeInformation;
                    // 캔버스
                    if(att.id === 'canvas-content'){
                        // resize min width, height 지정
                        var minHeight = 0, minWidth = 0;
                        for(var key in item.childArr[0]){
                            var child = item.childArr[0][key];

                            var compareY = child.pos.y + child.size.height + Number(child.outline.weight)*2;
                            if(minHeight<compareY){
                                minHeight = compareY
                            }

                            var compareX = child.pos.x + child.size.width + Number(child.outline.weight)*2;
                            if(minWidth<compareX){
                                minWidth = compareX
                            }
                        }

                        element.resizable(
                            {
                                handles: "n, e, s, w, nw, ne, sw,se",
                                minHeight: minHeight,
                                minWidth: minWidth
                            }
                        );
                    }
                });


                element.bind('mouseup', function (){
                    // 사이즈 업데이트
                    if(item){
                        item.size = {width: element.width(), height: element.height()};
                        if (item.state != 'new') {
                            item.state = 'edit';
                        }
                    }
                });

                // 포커싱 되었을 때 handle이 보이도록 함
                scope.id = att.id;
                var handle = element.find('.ui-resizable-handle');
                handle.attr('ng-show',"id == EditorData.focusId");
                $compile(handle)(scope);
            }
        };
    });
});
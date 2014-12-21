define([
    'app', 'jquery-ui', 'services/SetAttributeInformation'
], function (app) {
    app.directive('resizable', function (SetAttributeInformation, $compile) {

        return {
            // A = attribute, E = Element, C = Class and M = HTML Comment

            restrict:'A',
            link: function(scope, element, att) {
                element.resizable(
                    {
                        handles: "n, e, s, w, nw, ne, sw,se"
                    }
                );

                element.bind('mouseup', function (){
                    // 사이즈 업데이트
                    var item = SetAttributeInformation(att.id).attributeInformation;
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
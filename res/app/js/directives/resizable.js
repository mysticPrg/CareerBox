define([
    'app', 'jquery-ui', 'services/SetAttributeInformation'
], function (app) {
    app.directive('resizable', function (SetAttributeInformation) {

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
                    var item = SetAttributeInformation(att.id);
                    item.size = {width: element.width(), height: element.height()};
                    if (item.state != 'new') {
                        item.state = 'edit';
                    }
                    element.trigger('click');   // 없으면 이벤트가 씹힘... 왜 그런지는 모르겟음.
                });
            }
        };
    });
});
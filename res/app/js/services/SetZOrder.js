/**
 * Created by gimbyeongjin on 14. 12. 8..
 */
define([
    'app',
    'service/EditorData'
], function(app) {
    app.factory('SetZOrder', function (EditorData) {
        function SetZOrder(model, id) {
            // 아티클 안의 아이템이 아닐 경우
            if (!(typeof id == 'string' && id.indexOf("_") && id.split("_").length >= 3)) {
                EditorData.end_zOrder++;
                model.zOrder = EditorData.end_zOrder;
            }
        };

        return SetZOrder;
    });
});
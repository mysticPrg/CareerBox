/**
 * Created by gimbyeongjin on 14. 11. 30..
 */
define([
    'app',
    'services/EditorData'
], function (app) {
    app.factory('SetAttributeInformation', function (EditorData) {
        return function(id) {

            var idArray = "";
            if(typeof id == 'string')if(id.indexOf("_")) idArray = id.split("_");

            // 템플릿 에디터의 아이템 요소들일 경우
            var controllerType = window.location.href.split("#/")[1];
            if(controllerType == 'TemplateEditor'){
                return {
                    parentArray : EditorData.templateItemArray,
                    attributeInformation : EditorData.templateItemArray[id],
                    type : 'template_item'
                }
            };

            // 아티클 안의 요소들일 경우
            if(idArray.length == 3){
                // 아이디 파싱
                var articleId;
                if(id.split("_")[1] === 'load'){
                    articleId = id.split("_")[0];
                }else{
                    articleId = id.split("_")[0] + "_" + id.split("_")[1]
                }
                var childID = id.split("_")[2];

                // 모델 경로 설정 ** EditorData.childArr -> article
                for(var key in EditorData.childArr[articleId].childArr){
                    if(EditorData.childArr[articleId].childArr[key]._id == childID){
                        return {
                            parentArray : EditorData.childArr[articleId].childArr,
                            attributeInformation : EditorData.childArr[articleId].childArr[key],
                            type : 'acticle_item'
                        }
                    }
                };
            };

            // 아티클 자체일 경우
            return {
                parentArray : EditorData.childArr,
                attributeInformation : EditorData.childArr[id],
                type : 'acticle'
            }
        };
    });
});
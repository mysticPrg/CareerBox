/**
 * Created by gimbyeongjin on 14. 11. 30..
 */
define([
    'app',
    'services/EditorData'
], function (app) {
    app.factory('SetAttributeInformation', function (EditorData) {

        return function(id) {

            // 템플릿
            if(window.location.href.split("#/")[1] == 'TemplateEditor'){
                // 템플릿일 경우
                if(EditorData.template._id == id || id == "canvas-content"){
                    return {
                        parentArray : EditorData,
                        attributeInformation : EditorData.template.target,
                        type : 'template'
                    }
                }

                // 템플릿 안의 요소들일 경우
                else
                    return {
                        parentArray : EditorData.templateItemArray,
                        attributeInformation : EditorData.templateItemArray[id],
                        type : 'template_item'
                    }
            };

            // 템플릿
            if(window.location.href.split("partials/")[1].split('?')[0] == 'templatePreview.html'){
                // 템플릿일 경우
                if(EditorData.template._id == id || id == "canvas-content"){
                    return {
                        parentArray : EditorData,
                        attributeInformation : EditorData.template.target,
                        type : 'template'
                    }
                }

                // 템플릿 안의 요소들일 경우
                else
                    return {
                        parentArray : EditorData.templateItemArray,
                        attributeInformation : EditorData.templateItemArray[id],
                        type : 'template_item'
                    }
            };

            // 페이퍼

            // 페이퍼일 경우
            if(id == 'canvas-content' || id == EditorData.paper._id){
                return {
                            parentArray : EditorData,
                            attributeInformation : EditorData.paper,
                            type : 'paper'
                        }
            }

            // 아티클 안의 요소들일 경우
            var idArray = "";
            if(typeof id == 'string')if(id.indexOf("_")) idArray = id.split("_");
            if(idArray.length >= 3){
                // 아이디 파싱
                var articleId;
                var childID;

                if(isLoaded(id)){
                    articleId = id.split("_load_")[0];
                    childID = id.split("_load_")[1];
                }
                else{
                    articleId = id.split("_")[0] + "_" + id.split("_")[1];
                    childID = id.split("_")[2];
                }

                // 모델 경로 설정 ** EditorData.childArr -> article
                var articleModel = EditorData.childArr[articleId].childArr[0];
                for(var key in articleModel){
                    if(articleModel[key]._id == childID){
                        return {
                            parentArray : articleModel,
                            attributeInformation : articleModel[key],
                            type : 'acticle_item'
                        }
                    }
                };
            };

            function isLoaded(id){
                if(id.indexOf('load') >= 0)
                    return true;
                else
                    return false;
            }

            // 페이퍼에디터에서 아티클 자체이거나 아이템인 경우
            return {
                parentArray : EditorData.childArr,
                attributeInformation : EditorData.childArr[id],
                type : 'acticle'
            }
        };
    });
});
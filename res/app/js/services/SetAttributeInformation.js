/**
 * Created by gimbyeongjin on 14. 11. 30..
 */
define([
    'app',
    'services/EditorData'
], function (app) {
    app.factory('SetAttributeInformation', function (EditorData) {

        return function(id) {
            console.log('id',id);

            var idArray = "";
            if(typeof id == 'string')if(id.indexOf("_")) idArray = id.split("_");

            console.log('EditorData', EditorData);
            console.log('EditorData.paperList', EditorData.paperList);
            console.log('EditorData["focusId"]', EditorData['focusId']);

            // 템플릿 에디터의 아이템 요소들일 경우
            if(window.location.href.split("#/")[1] == 'TemplateEditor'){
                if(EditorData.template._id == id || id == "canvas-content")
                    return {
                        parentArray : EditorData,
                        attributeInformation : EditorData.template.target,
                        type : 'template'
                    }
                else
                    return {
                        parentArray : EditorData.templateItemArray,
                        attributeInformation : EditorData.templateItemArray[id],
                        type : 'template_item'
                    }
            };

            // 페이퍼일 경우
            if(id == 'canvas-content' || id == EditorData.paper._id){
                console.log('paper', EditorData.paperList);
                for(var key in EditorData.paperList){
                    if(EditorData.paperList[key]._id == EditorData.paperId)
                        return {
                            parentArray : EditorData,
                            attributeInformation : EditorData.paperList[key],
                            type : 'paper'
                        }
                }
            }

            // 아티클 안의 요소들일 경우
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
                for(var key in EditorData.childArr[articleId].childArr){
                    if(EditorData.childArr[articleId].childArr[key]._id == childID)
                        return {
                            parentArray : EditorData.childArr[articleId].childArr,
                            attributeInformation : EditorData.childArr[articleId].childArr[key],
                            type : 'acticle_item'
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
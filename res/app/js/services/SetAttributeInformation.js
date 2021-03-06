/**
 * Created by gimbyeongjin on 14. 11. 30..
 */
define([
    'app',
    'service/EditorData'
], function (app) {
    app.factory('SetAttributeInformation', function (EditorData) {
        return function (id) {
            // 템플릿
            if (isTemplate(window.location.href)) {
                // 템플릿일 경우
                if (EditorData.template._id === id || id === "canvas-content") {
                    return {
                        parentArray: EditorData.template,
                        attributeInformation: EditorData.template.target,
                        type: 'template'
                    };
                } else { // 템플릿 안의 요소들일 경우
                    return {
                        parentArray: EditorData.templateItemArray,
                        attributeInformation: EditorData.templateItemArray[id],
                        type: 'template_item'
                    };
                }
            }

            // 페이퍼

            // 페이퍼일 경우
            if (id === 'canvas-content' || id === EditorData.paper._id) {
                return {
                    parentArray: EditorData,
                    attributeInformation: EditorData.paper,
                    type: 'paper'
                };
            }

            // 아티클 안의 요소들일 경우
            var idArray = "";
            if (typeof id === 'string') {
                if (id.indexOf("_")) {
                    idArray = id.split("_");
                }
            }

            var articleId;
            // 배열아이디가 있을 경우
            if (idArray.length >= 4) {
                // 아이디 파싱
                var childID;
                var arrayId;
                if (isLoaded(id)) {
                    articleId = id.split("_")[0] + "_" + id.split("_")[1];
                    childID = id.split("_load_")[1].split("_")[0];
                    arrayId = id.split("_")[2];
                }
                else {
                    articleId = id.split("_")[0] + "_" + id.split("_")[1];
                    childID = id.split("_")[3];
                    arrayId = id.split("_")[2];
                }

                // 모델 경로 설정 ** EditorData.childArr -> article
                var articleModel = EditorData.childArr[articleId].childArr[arrayId];
                for (var key in articleModel) {
                    if (articleModel[key]._id === childID) {
                        return {
                            parentArray: articleModel,
                            attributeInformation: articleModel[key],
                            type: 'article_item'
                        };
                    }
                }
            }

            // 페이퍼에디터에서 아티클 자체이거나 아이템인 경우
            else if (typeof id === 'string' && id.split("_").length === 3) {
                // 아이디 파싱
                articleId = id.split("_")[0] + "_" + id.split("_")[1];

                return {
                    parentArray: EditorData.childArr,
                    attributeInformation: EditorData.childArr[articleId],
                    type: 'article'
                };
            }
            // 페이퍼에서 아이템일경우
            else {
                return {
                    parentArray: EditorData.childArr,
                    attributeInformation: EditorData.childArr[id],
                    type: 'paper_item'
                };
            }

            function isLoaded(id) {
                if (id.indexOf('load') >= 0) {
                    return true;
                } else {
                    return false;
                }
            }

            function isTemplate(url) {
                if ((url.indexOf('TemplateEditor') >= 0) || (url.indexOf('templatePreview') >= 0)) {
                    return true;
                } else {
                    return false;
                }
            }
        };
    });
});
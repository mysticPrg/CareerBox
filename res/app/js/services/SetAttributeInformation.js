/**
 * Created by gimbyeongjin on 14. 11. 30..
 */
define([
    'app',
    'services/EditorData'
], function (app) {
    app.factory('SetAttributeInformation', function (EditorData) {
        return function (id) {
//            console.log('id',id);

            var idArray = "";
            if(typeof id == 'string')if(id.indexOf("_")) idArray = id.split("_");

            var controllerType = window.location.href.split("#/")[1];
            if(controllerType == 'TemplateEditor'){
//                console.log('templateEditor');
                return EditorData.templateItemArray[id];
            } else if(idArray.length == 3){
                // 아티클 안의 요소들

                var templateID = id.split("_")[0] + "_" + id.split("_")[1];
                var childID = id.split("_")[2];

//                console.log('templateID',templateID);
//                console.log('childID',childID);

//                console.log('EditorData.childArr[templateID].childArr[childID]',EditorData.childArr[templateID].target[childID]);

//                return EditorData.childArr[templateID].target.childArr[childID];

                for(var key in EditorData.childArr[templateID].target.childArr){
//                    console.log('childArr',EditorData.childArr[templateID].target.childArr[key]);
                    if(EditorData.childArr[templateID].target.childArr[key]._id == childID){
                        return EditorData.childArr[templateID].target.childArr[key];
                    }
                };

            } else {
                // 아티클 자체
                return EditorData.childArr[id];
            };
        };
    });
});
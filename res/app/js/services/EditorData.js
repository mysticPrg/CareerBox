/**
 * Created by JEONGBORAM-PC-W1 on 2014-11-20.
 */
define(['app', 'classes/Paper', 'classes/Portfolio', 'classes/Templates/Template'], function(app, Paper, Portfolio, Template) {

    var EditorData = {
        editorType : '',
        portfolio : new Portfolio(),
        paper : new Paper(),
        paperId : '',
        paperTitle : '',
        paperItemArray : [],
        paperList : [],
        template : new Template(),
        templateState : '',
        templateItemArray : [],
        childArr: [],
        start_zOrder : null,
        end_zOrder : null,
        infoType : '',
        bindingData : [],
        shareId : '',

        focusId : '',
        focusInput : false
    };

    app.factory('EditorData', function() {
        return EditorData;
    });

    return EditorData;
});


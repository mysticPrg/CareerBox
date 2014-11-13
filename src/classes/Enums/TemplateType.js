/**
 * Created by careerBox on 2014-11-14.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function () {

    var TemplateType = {
        article: 'article',
        articleList: 'articleList',
        section: 'section'
    };

    return TemplateType;
});
/**
 * Created by careerBox on 2014-11-11.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/Util',
    'classes/Enums/ListType',
    'classes/LayoutComponents/Article'
], function (Util, ListType, Article) {

    function ArticleList() {
        Article.call(this);
        this.listType = ListType.vertical;
    };

    Util.inherit(ArticleList, Article);

    return ArticleList;
});
/**
 * Created by careerBox on 2014-11-21.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function () {

    var LayoutCompnentType = {
        article: 'article',
        item: 'item'
    };

    return LayoutCompnentType;
});
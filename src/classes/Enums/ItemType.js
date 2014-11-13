/**
 * Created by careerBox on 2014-11-11.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function () {

    var ItemType = {
        line: 'line',
        shape: 'shape',
        text: 'text',
        image: 'image',
        link: 'link'
    };

    return ItemType;
});
/**
 * Created by careerBox on 2014-12-17.
 */


if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function () {

    var PrimitiveTypeEnum = {
        string: 'string',
        number: 'number',
        boolean: 'boolean',
        file: 'file',
        image: 'image',
        term: 'term',
        date: 'date'
    };

    return PrimitiveTypeEnum;
});
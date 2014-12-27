/**
 * Created by careerBox on 2014-11-11.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function () {
    var Util = {};

    /**
     * @function getClass
     * @param obj
     * @returns {*}
     *
     * get a classname
     */
    Util.getClass = function getClass(obj) {
        if (obj && obj.constructor && obj.constructor.toString) {
            var arr = obj.constructor.toString().match(/function\s*(\w+)/);

            if (arr && arr.length === 2) {
                return arr[1];
            }
        }

        return undefined;
    };

    /**
     * @function inherit
     * @param subCls
     * @param superCls
     * @return {Object}
     *
     * make subclasses from superclass
     */
    Util.inherit = function inherit(subCls, superCls, props) {
        subCls.prototype = Object.create(superCls.prototype, props);
        subCls.prototype.constructor = superCls;

        return subCls;
    };

    return Util;
});
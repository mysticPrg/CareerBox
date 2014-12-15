/**
 * Created by careerBox on 2014-12-15.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function () {

    var InfoType = {
        personalInfo: 'personalInfo',
        additionalInfo: 'additionalInfo',
        highSchoolInfo: 'highSchoolInfo',
        univSchoolInfo: 'univSchoolInfo'
    };

    return InfoType;
});
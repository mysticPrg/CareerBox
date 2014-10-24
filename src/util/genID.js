/**
 * Created by careerBox on 2014-10-25.
 */

var uuid = require('node-uuid');

function genID() {
    var newID = uuid.v1();
    newID = newID.replace(/-/gi, '');
    newID = newID.substr(0, 9);

    return newID;
}

module.exports = genID;
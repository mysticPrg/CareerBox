/**
 * Created by careerBox on 2014-10-25.
 */

var ObjectID = require('mongodb').ObjectID;

function genID() {
    return (new ObjectID()).toHexString();
}

module.exports = genID;
/**
 * Created by careerBox on 2014-11-13.
 */

var requirejs = require('requirejs');

requirejs.config({
    base: __dirname,
    nodeRequire: require,
    paths: {
        classes: 'src/classes'
    }
});

module.exports = requirejs;
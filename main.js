/**
 * Created by mysticPrg on 2014-09-22.
 */

var requirejs = require('requirejs')

requirejs.config({
    base: __dirname,
    nodeRequire: require,
    paths: {
        classes: 'src/classes',
        services: 'src/services',
        util: 'src/util'
    }
});

var Shape = requirejs('classes/LayoutComponents/Items/Shape');

console.log(new Shape());

var server = require('./src/services/server');

var member = require('./src/services/member');
var paper = require('./src/services/paper');

member.set(server);
paper.set(server);

server.start(8123);


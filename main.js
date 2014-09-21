/**
 * Created by mysticPrg on 2014-09-22.
 */

var server = require('./src/server');
var item = require('./src/paper');

paper.set(server);

server.start(8123);
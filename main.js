/**
 * Created by mysticPrg on 2014-09-22.
 */

var server = require('./src/server');

var member = require('./src/member');
var paper = require('./src/paper');

member.set(server);
paper.set(server);

server.start(8123);

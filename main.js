/**
 * Created by mysticPrg on 2014-09-22.
 */

var server = require('./src/services/server');

var MemberService = require('./src/services/member');
var PaperService = require('./src/services/paper');
var PortfolioService = require('./src/services/PortfolioService');
var TemplateService = require('./src/services/TemplateService');

MemberService.set(server);
PaperService.set(server);
PortfolioService.set(server);
TemplateService.set(server);

server.start(8123);

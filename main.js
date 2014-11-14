/**
 * Created by mysticPrg on 2014-09-22.
 */

var server = require('./src/services/server');

var MemberService = require('./src/services/MemberService');
var PortfolioService = require('./src/services/PortfolioService');
var TemplateService = require('./src/services/TemplateService');
var PaperService = require('./src/services/PaperService');

MemberService.set(server);
PortfolioService.set(server);
TemplateService.set(server);
PaperService.set(server);

server.start(8123);

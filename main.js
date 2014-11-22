/**
 * Created by mysticPrg on 2014-09-22.
 */

var capture = require('./src/util/Capture');
var genID = require('./src/util/genID');

var server = require('./src/services/server');

var MemberService = require('./src/services/MemberService');
var PortfolioService = require('./src/services/PortfolioService');
var TemplateService = require('./src/services/TemplateService');
var PaperService = require('./src/services/PaperService');

MemberService.set(server);
PortfolioService.set(server);
TemplateService.set(server);
PaperService.set(server);

server.get('/capture', function(req, res) {
    capture(genID(), genID());

    res.end();
});

server.start(8123);

//var capture = require('./src/util/Capture');
//capture('<div></div>', 'test');

//var $ = require('jquerygo');
//$.config.addJQuerty = false;
//$('<html><div></div></html>', function() {
//    $('div').html('testcodeHTml', function() {
//        $('html').html(function (result) {
//            console.log(result);
//        })
//    })
//})
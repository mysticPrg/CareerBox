/**
 * Created by mysticPrg on 2014-09-22.
 */

//var capture = require('./src/util/Capture');
//var genID = require('./src/util/genID');
//
//var server = require('./src/services/server');
//
//var MemberService = require('./src/services/MemberService');
//var PortfolioService = require('./src/services/PortfolioService');
//var TemplateService = require('./src/services/TemplateService');
//var PaperService = require('./src/services/PaperService');
//
//MemberService.set(server);
//PortfolioService.set(server);
//TemplateService.set(server);
//PaperService.set(server);
//
//server.get('/capture', function(req, res) {
//    capture(genID(), genID());
//
//    res.end();
//});
//
//server.start(8123);

//var jsdom = require('jsdom').jsdom;
//var myWindow = jsdom().parentWindow;
//var $ = require('jquery')(myWindow);
//
//var HTMLGen = require('./src/util/HTMLGen');
//
//var requirejs = require('./src/require.config');
//var Text = requirejs('classes/LayoutComponents/Items/Text');
//var t = new Text();
//
//t._id = '1129asd3150125';
//
//var capture = require('./src/util/Capture');
//capture(HTMLGen.itemToHTML(t), 'test', {width: t.width, height: t.height}, 200);
//

var requirejs = require('./src/require.config');
var Text = requirejs('classes/LayoutComponents/Items/Text');
var Icon = requirejs('classes/LayoutComponents/Items/Icon');
var IconType = requirejs('classes/Enums/IconType');

var capture = require('./src/util/Capture');

var t = new Icon();
t._id = '1129asd3150125';

t.size.width = 10;
t.size.height = 10;
t.outline.use = false;
//t.pos.x = 10;
//t.pos.y = 20;
//t.radius = 10;
//t.rotate = 0;

t.iconType = IconType.film;

//t.outline.use = false;

capture(t);
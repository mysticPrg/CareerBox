/**
 * Created by mysticPrg on 2014-09-22.
 */


var server = require('./src/services/server');

var MemberService = require('./src/services/MemberService');
var PortfolioService = require('./src/services/PortfolioService');
var TemplateService = require('./src/services/TemplateService');
var PaperService = require('./src/services/PaperService');
var FileService = require('./src/services/FileService');
var ImageService = require('./src/services/ImageService');

var PersonalInfoService = require('./src/services/Info/PersonalInfoService');
var AdditionalInfoService = require('./src/services/info/AdditionalInfoService');
var HighSchoolInfoService = require('./src/services/Info/HighSchoolInfoService');
var UnivSchoolInfoService = require('./src/services/Info/UnivSchoolInfoService');
var WorkingInfoService = require('./src/services/Info/WorkingInfoService');
var CertificationAbilityInfoService = require('./src/services/Info/CertificationAbilityInfoService');
var ProficiencyInfoService = require('./src/services/Info/ProficiencyInfoService');
var ComputerAbilityInfoService = require('./src/services/Info/ComputerAbilityInfoService');
var PaperAbilityInfoService = require('./src/services/Info/PaperAbilityInfoService');
var ScholarshipInfoService = require('./src/services/Info/ScholarshipInfoService');
var AwardInfoService = require('./src/services/Info/AwardInfoService');
var LocalActivityInfoService = require('./src/services/Info/LocalActivityInfoService');
var GlobalActivityInfoService = require('./src/services/Info/GlobalActivityInfoService');
var ProjectInfoService = require('./src/services/Info/ProjectInfoService');
var ColumnInfoService = require('./src/services/Info/ColumnInfoService');

MemberService.set(server);
PortfolioService.set(server);
TemplateService.set(server);
PaperService.set(server);
FileService.set(server);
ImageService.set(server);

PersonalInfoService.set(server);
AdditionalInfoService.set(server);
HighSchoolInfoService.set(server);
UnivSchoolInfoService.set(server);
WorkingInfoService.set(server);
CertificationAbilityInfoService.set(server);
ProficiencyInfoService.set(server);
ComputerAbilityInfoService.set(server);
PaperAbilityInfoService.set(server);
ScholarshipInfoService.set(server);
AwardInfoService.set(server);
LocalActivityInfoService.set(server);
GlobalActivityInfoService.set(server);
ProjectInfoService.set(server);
ColumnInfoService.set(server);

server.start(8123);


//var genID = require('./src/util/genID');
//
//
//var requirejs = require('./src/require.config');
//
//var Paper = requirejs('classes/Paper');
//var Article = requirejs('classes/LayoutComponents/Article');
//
//var Text = requirejs('classes/LayoutComponents/Items/Text');
//var Shape = requirejs('classes/LayoutComponents/Items/Shape');
//var Link = requirejs('classes/LayoutComponents/Items/Link');
//var Color = requirejs('classes/Structs/Color');
//var Icon = requirejs('classes/LayoutComponents/Items/Icon');
//var IconType = requirejs('classes/Enums/IconType');
//
//var Size = requirejs('classes/Structs/Size');
//var Position = requirejs('classes/Structs/Position');
//var Outline = requirejs('classes/Structs/Outline');
//
//var capture = require('./src/util/Capture');
//
//var p = new Paper({
//    _id: genID()
//});
//
//var a = new Article({
//   _id: genID(),
//    size: new Size({width: 600, height: 600}),
//    rotate: 30
//});
//
//a.childArr.push(new Text({
//    _id: genID(),
//    size: new Size({width: 100, height: 200}),
//    pos: new Position({x: 10, y: 20}),
//    value: 'text1'
//}));
//
//a.childArr.push(new Text({
//    _id: genID(),
//    size: new Size({width: 100, height: 200}),
//    pos: new Position({x: 300, y: 300}),
//    value: 'text2'
//}));
//
//p.childArr.push(a);
//
//capture(p, function() {
//    console.log('Capure Complete!');
//});


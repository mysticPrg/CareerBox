/**
 * Created by mysticPrg on 2014-09-22.
 */

///*
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

var ResetService = require('./src/services/ResetService');

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

ResetService.set(server);

server.start(8123);

/**/

/*
var CaptureFromSite = require('./src/util/CaptureFromSite');
CaptureFromSite('54943111ad000fb818d166b5', 'portfolio', function(err) {
   console.log('done');
});
/**/

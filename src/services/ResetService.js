/**
 * Created by careerBox on 2014-12-19.
 */

var ServiceUtil = require('../util/ServiceUtil');

//var MemberDB = require('../db/MemberDB');
var FileDB = require('../db/FileDB');
var ImageDB = require('../db/ImageDB');
var PaperDB = require('../db/PaperDB');
var PortfolioDB = require('../db/PortfolioDB');
var TemplateDB = require('../db/TemplateDB');

var AdditionalInfoDB = require('../db/Info/AdditionalInfoDB');
var AwardInfoDB = require('../db/Info/AwardInfoDB');
var CertificationAbilityInfoDB = require('../db/Info/CertificationAbilityInfoDB');
var ColumnInfoDB = require('../db/Info/ColumnInfoDB');
var ComputerAbilityInfoDB = require('../db/Info/ComputerAbilityInfoDB');
var GlobalActivityInfoDB = require('../db/Info/GlobalActivityInfoDB');
var HighSchoolInfoDB = require('../db/Info/HighSchoolInfoDB');
var LocalActivityInfoDB = require('../db/Info/LocalActivityInfoDB');
var PaperAbilityInfoDB = require('../db/Info/PaperAbilityInfoDB');
var PersonalInfoDB = require('../db/Info/PersonalInfoDB');
var ProficiencyInfoDB = require('../db/Info/ProficiencyInfoDB');
var ProjectInfoDB = require('../db/Info/ProjectInfoDB');
var ScholarshipInfoDB = require('../db/Info/ScholarshipInfoDB');
var UnivSchoolInfoDB = require('../db/Info/UnivSchoolInfoDB');
var WorkingInfoDB = require('../db/Info/WorkingInfoDB');



function resetService(req, res) {

    ServiceUtil.setResHeader(res);

    var DBArr = [
//        MemberDB,

        FileDB,
        ImageDB,
        PaperDB,
        PortfolioDB,
        TemplateDB,

        AdditionalInfoDB,
        AwardInfoDB,
        CertificationAbilityInfoDB,
        ColumnInfoDB,
        ComputerAbilityInfoDB,
        GlobalActivityInfoDB,
        HighSchoolInfoDB,
        LocalActivityInfoDB,
        PaperAbilityInfoDB,
        PersonalInfoDB,
        ProficiencyInfoDB,
        ProjectInfoDB,
        ScholarshipInfoDB,
        UnivSchoolInfoDB,
        WorkingInfoDB
    ];

    for ( var i=0 ; i<DBArr.length ; i++ ) {
        DBArr[i].reset();
    }

    ServiceUtil.sendResult(null, res, null);
}

module.exports.set = function (server) {
    server.post('/reset', resetService);
};
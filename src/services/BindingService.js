/**
 * Created by careerBox on 2014-12-21.
 */

var async = require('async');

var requirejs = require('../require.config');

var infoType = requirejs('classes/Enums/InfoType');
var LayoutCompnentType = requirejs('classes/Enums/LayoutCompnentType');

var PersonalInfoDB = require('../db/Info/PersonalInfoDB');
var AdditionalInfoDB = require('../db/Info/AdditionalInfoDB');
var HighSchoolInfoDB = require('../db/Info/HighSchoolInfoDB');
var UnivSchoolInfoDB = require('../db/Info/UnivSchoolInfoDB');
var WorkingInfoDB = require('../db/Info/WorkingInfoDB');
var CertificationAbilityInfoDB = require('../db/Info/CertificationAbilityInfoDB');
var ProficiencyInfoDB = require('../db/Info/ProficiencyInfoDB');
var ComputerAbilityInfoDB = require('../db/Info/ComputerAbilityInfoDB');
var PaperAbilityInfoDB = require('../db/Info/PaperAbilityInfoDB');
var ScholarshipInfoDB = require('../db/Info/ScholarshipInfoDB');
var AwardInfoDB = require('../db/Info/AwardInfoDB');
var LocalActivityInfoDB = require('../db/Info/LocalActivityInfoDB');
var GlobalActivityInfoDB = require('../db/Info/GlobalActivityInfoDB');
var ProjectInfoDB = require('../db/Info/ProjectInfoDB');
var ColumnInfoDB = require('../db/Info/ColumnInfoDB');

var infoDBs = {};
infoDBs[infoType.personalInfo] = PersonalInfoDB;
infoDBs[infoType.additionalInfo] = AdditionalInfoDB;
infoDBs[infoType.highSchoolInfo] = HighSchoolInfoDB;
infoDBs[infoType.univSchoolInfo] = UnivSchoolInfoDB;
infoDBs[infoType.workingInfo] = WorkingInfoDB;
infoDBs[infoType.certificationAbilityInfo] = CertificationAbilityInfoDB;
infoDBs[infoType.proficiencyInfo] = ProficiencyInfoDB;
infoDBs[infoType.computerAbilityInfo] = ComputerAbilityInfoDB;
infoDBs[infoType.paperAbilityInfo] = PaperAbilityInfoDB;
infoDBs[infoType.scholarshipInfo] = ScholarshipInfoDB;
infoDBs[infoType.awardInfo] = AwardInfoDB;
infoDBs[infoType.localActivityInfo] = LocalActivityInfoDB;
infoDBs[infoType.globalActivityInfo] = GlobalActivityInfoDB;
infoDBs[infoType.projectInfo] = ProjectInfoDB;
infoDBs[infoType.columnInfo] = ColumnInfoDB;

var bindFuncs = {};
bindFuncs[infoType.personalInfo] = bindForPersonalInfo;
bindFuncs[infoType.additionalInfo] = bindForAdditionalInfo;
bindFuncs[infoType.highSchoolInfo] = bindForHighSchoolInfo;
bindFuncs[infoType.univSchoolInfo] = bindForUnivSchoolInfo;
bindFuncs[infoType.workingInfo] = bindForWorkingInfo;
bindFuncs[infoType.certificationAbilityInfo] = bindForCertificationAbilityInfo;
bindFuncs[infoType.proficiencyInfo] = bindForProficiencyInfo;
bindFuncs[infoType.computerAbilityInfo] = bindForComputerAbilityInfo;
bindFuncs[infoType.paperAbilityInfo] = bindForPaperAbilityInfo;
bindFuncs[infoType.scholarshipInfo] = bindForScholarshipInfo;
bindFuncs[infoType.awardInfo] = bindForAwardInfo;
bindFuncs[infoType.localActivityInfo] = bindForLocalActivityInfo;
bindFuncs[infoType.globalActivityInfo] = bindForGlobalActivityInfo;
bindFuncs[infoType.projectInfo] = bindForProjectInfo;
bindFuncs[infoType.columnInfo] = bindForColumnInfo;

function paperBinding(paper, _member_id, callback) {
    var child = paper.childArr;

    async.forEach(child, function (obj, callbackInForeach) {
        if (obj.layoutComponentType === LayoutComponentType.article) {
            articleBinding(obj, _member_id, callbackInForeach);
        } else {
            callbackInForeach();
        }
    }, callback);
}

function articleBinding(article, _member_id, callback) {
    if (!article.isBinding) {
        return;
    }

    var infoDB = infoDBs[article.bindingType.infoType];
    var bindFunc = bindFuncs[article.bindingType.infoType];

    // info 자체에 데이터가 있는 경우
    if (article.bindingType === 'personalInfo' || article.bindingType === 'additionalInfo') {
        infoDB.read(_member_id, function (err, finded) {
            var bindedChildArr = bindFunc(finded);
            article.childArr = [bindedChildArr];
            callback();
        });
    }
    else { // info.item 구조인 경우
        infoDB.read(_member_id, function (err, finded) {
            var bindedChildArr = [];

            var childs = finded.childArr;
            for ( var i=0 ; i<childs.length ; i++ ) {
                if ( article.bindingData.indexOf(childs._id) === -1 ) {
                    continue;
                }
                bindedChildArr.push(bindFunc(childs[i]));
            }
            callback();
        });
    }
}

function bindForPersonalInfo () {

}

function bindForAdditionalInfo () {

}

function bindForHighSchoolInfo () {

}

function bindForUnivSchoolInfo () {

}

function bindForWorkingInfo () {

}

function bindForCertificationAbilityInfo () {

}

function bindForProficiencyInfo () {

}

function bindForComputerAbilityInfo () {

}

function bindForPaperAbilityInfo () {

}

function bindForScholarshipInfo () {

}

function bindForAwardInfo () {

}

function bindForLocalActivityInfo () {

}

function bindForGlobalActivityInfo () {

}

function bindForProjectInfo () {

}

function bindForColumnInfo () {

}


module.exports = paperBinding;
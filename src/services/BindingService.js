/**
 * Created by careerBox on 2014-12-21.
 */

var async = require('async');

var requirejs = require('../require.config');

var InfoType = requirejs('classes/Enums/InfoType');
var ItemType = requirejs('classes/Enums/itemType');
var LayoutComponentType = requirejs('classes/Enums/LayoutComponentType');
var Term = requirejs('classes/Structs/Term');

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
infoDBs[InfoType.personalInfo] = PersonalInfoDB;
infoDBs[InfoType.additionalInfo] = AdditionalInfoDB;
infoDBs[InfoType.highSchoolInfo] = HighSchoolInfoDB;
infoDBs[InfoType.univSchoolInfo] = UnivSchoolInfoDB;
infoDBs[InfoType.workingInfo] = WorkingInfoDB;
infoDBs[InfoType.certificationAbilityInfo] = CertificationAbilityInfoDB;
infoDBs[InfoType.proficiencyInfo] = ProficiencyInfoDB;
infoDBs[InfoType.computerAbilityInfo] = ComputerAbilityInfoDB;
infoDBs[InfoType.paperAbilityInfo] = PaperAbilityInfoDB;
infoDBs[InfoType.scholarshipInfo] = ScholarshipInfoDB;
infoDBs[InfoType.awardInfo] = AwardInfoDB;
infoDBs[InfoType.localActivityInfo] = LocalActivityInfoDB;
infoDBs[InfoType.globalActivityInfo] = GlobalActivityInfoDB;
infoDBs[InfoType.projectInfo] = ProjectInfoDB;
infoDBs[InfoType.columnInfo] = ColumnInfoDB;

var setFuncs = {};
setFuncs[ItemType.image] = setImage;
setFuncs[ItemType.text] = setText;
setFuncs[ItemType.link] = setLink;

setFuncs[ItemType.line] = setDefault
setFuncs[ItemType.shape] = setDefault;
setFuncs[ItemType.icon] = setDefault;


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

    // info 자체에 데이터가 있는 경우
    if (article.bindingType.infoType === 'personalInfo' || article.bindingType.infoType === 'additionalInfo') {
        infoDB.read(_member_id, function (err, finded) {

            if (!finded) {
                callback();
                return;
            }

            finded._id = finded._id.toHexString();
            var bindedChildArr = bindItems(article.childArr[0], finded);
            article.childArr = [bindedChildArr];
            callback();
        });
    }
    else { // info.item 구조인 경우
        infoDB.read(_member_id, function (err, finded) {

            if (!finded) {
                callback();
                return;
            }

            var bindedChildArr = [];

            var childs = finded.items;
            for ( var i=0 ; i<childs.length ; i++ ) {
                if ( article.bindingData.indexOf(childs[i]._id) === -1 ) {
                    continue;
                }
                bindedChildArr.push(bindItems(article.childArr[0], childs[i]));
            }
            callback();
        });
    }
}

function getInfoValue(infoType, infoData) {
    var type = infoType[0];

    switch (type) {
        case 'S':
            return infoData;

        case 'N':
            return '' + infoData;

        case 'B':
            if ( infoData ) {
                return true;
            } else {
                return false;
            }

        case 'F':
            return infoData._id;

        case 'I':
            return infoData._id;

        case 'D':
            var tempDate = new Date(infoData);
            return '' + tempDate.getYear() + '-' + tempDate.getMonth() + '-' + tempDate.getDate();

        case 'T':
            var tempTerm = new Term(infoData);
            return '' + tempTerm.start.getYear() + '-' + tempTerm.start.getMonth() + '-' + tempTerm.start.getDate() + ' ~ ' +
                tempTerm.end.getYear() + '-' + tempTerm.end.getMonth() + '-' + tempTerm.end.getDate();

        default:
            return '';
    }
}

function setImage(layoutItem, infoData) {
    layoutItem.thumbnail = getInfoValue(layoutItem.bindingType, infoData);
}

function setText(layoutItem, infoData) {
    layoutItem.value = getInfoValue(layoutItem.bindingType, infoData);
}

function setLink(layoutItem, infoData) {
    layoutItem.url = getInfoValue(layoutItem.bindingType, infoData);
}

function setDefault(layoutItem) {
    return layoutItem;
}

function bindItems (layoutItems, infoData) {

    var resultArr = [];

    for (var k in layoutItems) {
        var bindedLayoutItem = setFuncs[layoutItems[k].itemType](layoutItems[k], infoData[layoutItems[k].bindingType]);
        resultArr.push(bindedLayoutItem);
    }

    return resultArr;
}

module.exports = paperBinding;
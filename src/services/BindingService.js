/**
 * Created by careerBox on 2014-12-21.
 */

var async = require('async');

var requirejs = require('../require.config');

var InfoType = requirejs('classes/Enums/InfoType');
var ItemType = requirejs('classes/Enums/itemType');
var LayoutComponentType = requirejs('classes/Enums/LayoutComponentType');
var Term = requirejs('classes/Structs/Term');

var Image = requirejs('classes/LayoutComponents/Items/Image');
var Text = requirejs('classes/LayoutComponents/Items/Text');
var Link = requirejs('classes/LayoutComponents/Items/Link');


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

setFuncs[ItemType.line] = setDefault;
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
        callback();
        return;
    } else if (article.bindingData && article.bindingData.length === 0) {
        callback();
        return;
    }

    var infoDB = infoDBs[article.bindingType.infoType];
    if (!infoDB) {
        callback();
        return;
    }

    infoDB.read(_member_id, function (err, finded) {

        if (!finded) {
            callback();
            return;
        }

        var bindedChildArr = [];

        var childs = finded.items;
        for (var i = 0; i < childs.length; i++) {
            if (article.bindingData.indexOf(childs[i]._id) === -1) {
                continue;
            }
            bindedChildArr.push(bindItems(article.childArr[0], childs[i]));
        }
        article.childArr = bindedChildArr;
        callback();
    });
//    }
}

function getInfoValue(infoType, infoData) {
    var type = infoType[0];

    switch (type) {
        case 'S':
            return infoData;

        case 'N':
            return '' + infoData;

        case 'B':
            if (infoData) {
                return '해당';
            }
            return '해당없음';

        case 'F':
            if (infoData) {
                return infoData._id;
            }
            return '';

        case 'I':
            if (infoData) {
                return infoData._id;
            }
            return '';

        case 'D':
            var tempDate = new Date(infoData);
            return '' + (1900 + tempDate.getYear()) + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate();

        case 'T':
            var tempTerm = new Term(infoData);
            return '' + (1900 + tempTerm.start.getYear()) + '-' + (tempTerm.start.getMonth() + 1) + '-' + tempTerm.start.getDate() + ' ~ ' +
                (1900 + tempTerm.end.getYear()) + '-' + (tempTerm.end.getMonth() + 1) + '-' + tempTerm.end.getDate();

        default:
            return '';
    }
}

function setImage(layoutItem, infoData) {
    var newItem = new Image(layoutItem);
    newItem.thumbnail = getInfoValue(layoutItem.bindingType, infoData);
    return newItem;
}

function setText(layoutItem, infoData) {
    var newItem = new Text(layoutItem);
    newItem.value = getInfoValue(layoutItem.bindingType, infoData);
//    console.log(newItem.value);
    return newItem;
}

function setLink(layoutItem, infoData) {
    var newItem = new Link(layoutItem);
    newItem.url = getInfoValue(layoutItem.bindingType, infoData);
    return newItem;
}

function setDefault(layoutItem) {
    return layoutItem;
}

function bindItems(layoutItems, infoData) {

//    console.log(infoData._id);

    var resultArr = [];
    var k;
    for (k in layoutItems) {

        if (layoutItems[k].isBinding) {
            var bindedLayoutItem = setFuncs[layoutItems[k].itemType](layoutItems[k], infoData[layoutItems[k].bindingType]);
            resultArr.push(bindedLayoutItem);
        } else {
            resultArr.push(layoutItems[k]);
        }
    }

    return resultArr;
}

module.exports = paperBinding;
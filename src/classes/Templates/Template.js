/**
 * Created by careerBox on 2014-11-11.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'classes/LayoutComponents/Article',
    'classes/Enums/TemplateType'
], function (Article, TemplateType) {

    function createTarget(template, data) {
        switch (template.templateType) {
            case TemplateType.article:
                template.target = new Article(data);
                break;

            case TemplateType.section:
                break;
        }
    }

    function Template(props) {
        this._id = null;
        this.title = 'New Template';
        this.templateType = TemplateType.article;
        this.target = null;
        this.description = '';
        this.timestamp = new Date();
        this.thumbnail = null;

        // server only
        this._member_id = null;

        if (props) {
            this._id = props._id ? props._id : null;
            this.title = props.title ? props.title : this.title;
            this.templateType = props.templateType ? props.templateType : this.templateType;
            this.target = props.target ? props.target : this.target;
            this.description = props.description ? props.description : this.description;
            this.timestamp = props.timestamp ? props.timestamp : this.timestamp;
            this.thumbnail = props.thumbnail ? props.thumbnail : this.thumbnail;

            this._member_id = props._member_id ? props._member_id : this._member_id;

            if (props.target) {
                createTarget(this, props.target);
            }
        }
    }
    ;

    Template.prototype.instanciate = function instanciate() {
        // TODO: 여기에 target을 복제하는 코드 작성
        console.log('instanciate!');
        return this.childArr;
    };

    return Template;
});
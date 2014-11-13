/**
 * Created by careerBox on 2014-11-11.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function () {

    function Template() {
        this._id = null;
        this.target = null;
        this.title = 'New Template';
        this.thumbnail = null;

        // server only
        this._member_id = null;
    };

    Template.prototype.instanciate = function instanciate() {
        // TODO: 여기에 target을 복제하는 코드 작성
        console.log('instanciate!');
        return this.target;
    };

    return Template;
});
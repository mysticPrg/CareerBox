/**
 * Created by careerBox on 2014-12-16.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function () {

    function Term(props) {
        this.start = new Date();
        this.end = new Date();

        if (props) {
            this.start = props.start ? props.start : this.start;
            this.end = props.end ? props.end : this.end;
        }
    };

    return Term;
});
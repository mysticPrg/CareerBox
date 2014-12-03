/**
 * Created by careerBox on 2014-11-22.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function () {

    function PaperInfo(props) {
        this._portfolio_id = null;
        this.title = '';

        if (props) {
            this._portfolio_id = props._portfolio_id ? props._portfolio_id : this._portfolio_id;
            this.title = props.title ? props.title : this.title;
        }
    };

    return PaperInfo;
});
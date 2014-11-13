/**
 * Created by careerBox on 2014-11-11.
 */

function PortfolioDao(props) {

    this._id = null;
    this._member_id = null;

    this.title = '';
    this.datetime = new Date();
    this.description = '';

    if (props) {
        this._id = props._id ? props._id : null;
        this._member_id = props._member_id ? props._member_id : null;

        this.title = props.title ? props.title : this.title;
        this.datetime = props.datetime ? props.datetime : this.datetime;
        this.description = props.description ? props.description : this.description;
    }
};

module.exports = PortfolioDao;

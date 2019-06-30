import React from 'react';
import { connect } from 'react-redux';
import {logoutUser} from '../../actions/userAction'
import utils from '../../common/utils/utils'
@connect()
class LogOutPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.props.dispatch(logoutUser());
        utils.deleteCookie();
    }

    componentDidUpdate(prevProps, preState) {
    }



    componentDidMount() {

    }


    render() {
        return (
            <div>
                <span>you already logged out!</span>
                <span>thak you and hope to see you again!</span>
            </div>
        )

    }
}

export default LogOutPage;

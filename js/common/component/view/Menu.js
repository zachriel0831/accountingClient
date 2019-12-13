import React from 'react';
import { connect } from 'react-redux';
import utils from '../../utils/utils'

@connect((store) => {
    return {
        userReducer: store.userReducer,
    };
})
class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }

    }

    render() {
        const { userDetail } = this.props.userReducer;
        let userName = (userDetail) ? userDetail[0].name : '';

        let storage = localStorage;
        let loggedView = [];

        if (storage.token && storage.username) {

            loggedView = utils.changeMenuView('GET_lOGGEDIN_VIEW', this.props.MainRouter, this.routing, this.props.dispatch);

        } else {
            this.navs = [];
            utils.clearAllSession();
            loggedView = utils.changeMenuView('GET_lOGGEDOUT_VIEW', this.props.MainRouter, this.props.routing, this.props.dispatch);

        }

        return (
            <div>
                <div className="ui secondary pointing menu">
                    {loggedView}
                    {/* <div class="right menu">
                        <a class="ui item">
                            Logout
                     </a>
                    </div> */}
                </div>
            </div>
        )
    }
}

export default Menu;

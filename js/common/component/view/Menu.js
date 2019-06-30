import React from 'react';
import { connect } from 'react-redux';

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

    componentDidUpdate(prevProps, preState) {

    }



    componentDidMount() {

    }

    render() {
        const { userDetail } = this.props.userReducer;
        let userName = (userDetail) ? userDetail[0].name : '';

        return (
                <div className="card text-center">
                    <div className="card-header">
                    <span style={{ display: userName !== '' ? 'block' : 'none', float: 'right' }}>hi , {userName}</span>
                        <ul className="nav nav-pills card-header-pills">
                            {this.props.nav}
                        </ul>
                    </div>
                </div>
        )
    }
}

export default Menu;

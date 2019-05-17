import React from 'react';

import { BrowserRouter as Router, Route } from 'react-router-dom'
import { connect } from 'react-redux';
import { fetchUser } from '../../actions/userAction'


@connect((store) => {
    return {
        user: store.userReducer.user,
        //   newAccount:store.newAccountingReducer
    };
})
class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }

        let storage = localStorage

        let data = {};
            data.token = storage.token;
            data.username = storage.username;

        if (data.username != undefined && data.token != undefined) {
            this.props.dispatch(fetchUser(data));
        }else{
            window.location.hash = '/Login'

            this.props.dispatch({
                type:'USER_LOGOUT',
            })
        }

    }

    componentDidUpdate(prevProps, preState) {
    }



    componentDidMount() {

    }

    render() {
        console.log(this.props)
        const { user } = this.props;
        let userName = user === undefined ? 'please login first' : user.name;
        return (
            <div>
                <h1>hi ,{userName} </h1>
                <div>
                    <span>this world loves you!</span>
                </div>
            </div>
        )

    }
}

export default Home;

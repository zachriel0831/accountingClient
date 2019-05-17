import React from 'react';
import Text from '../../common/component/input/Text'
import AccountForm from '../../common/component/formcore/AccountForm';
import Password from '../../common/component/input/Password'
import { connect } from 'react-redux';
import {submitLogin } from '../../actions/userAction'

@connect((store) => {
    return {
        user: store.userReducer.user,
    };
})
class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }

    }

    componentDidUpdate(prevProps, preState) {
    }



    componentDidMount() {

    }

    handleSubmit(user) {
        console.log(user);
        this.props.dispatch(submitLogin('USER_LOGGEDIN',
            {
                password: user.password,
                user_id: user.user_id,

            })
        );



    }

    emailIsValid(email) {

        console.log(email);
    }

    customOnchange(e) {

        console.log(e);
    }

    onEmailBlur(e) {

        console.log(e);
    }

    render() {
        let user = this.props.user

        return (
            <div>
                <AccountForm model={user} onSubmit={(user) => this.handleSubmit(user)} >
                    <h1>this is login page</h1>

                    <label htmlFor="user_id">id:</label>
                    <Text
                        placeholder='please type your id'
                        type="id"
                        name="user_id"
                        required
                    />
                    <br />
                    <label htmlFor="password">password:</label>
                    <Password
                        placeholder='please type your password'
                        type="password"
                        name="password"
                        required
                    />

                    <button type="submit">
                        login!
                    </button>

                </AccountForm>
            </div>
        )

    }
}

export default Login;

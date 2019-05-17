import React from 'react';
import Text from '../../common/component/input/Text'
import AccountForm from '../../common/component/formcore/AccountForm';
import Password from '../../common/component/input/Password'
import { connect } from 'react-redux';
import { subscribeUser } from '../../actions/userAction'

@connect((store) => {
    return {
        user: store.userReducer.user,
    };
})
class RegisterPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }

        let f = localStorage

        if(f.token && f.username){

            window.location.hash = '/Home'
        }
    }

    componentDidUpdate(prevProps, preState) {
    }



    componentDidMount() {

    }

    handleSubmit(user) {
        console.log(user);
        this.props.dispatch(subscribeUser('SUBSCRIBE_USER',
            {
                password: user.password,
                email: user.email,
                name: user.name,
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
                    <h1>this is subscribe page</h1>

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
                    <br />
                    <label htmlFor="name">name:</label>
                    <Text
                        placeholder='please type your name'
                        type="name"
                        name="name"
                        required

                    />
                    <br />
                    <label htmlFor="user.email">email:</label>
                    <Text
                        type="email"
                        name="email"
                        onChange={(e) => this.customOnchange(e)}
                        // onBlur={(e) => this.onEmailBlur(e)}
                        required
                        placeholder="please type your email"
                    />
                    <br />

                    <button type="submit">
                        Subscribe!
                    </button>

                </AccountForm>
            </div>
        )

    }
}

export default RegisterPage;

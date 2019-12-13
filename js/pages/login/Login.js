import React from 'react';
import Text from '../../common/component/input/Text'
import AccountForm from '../../common/component/formcore/AccountForm';
import Password from '../../common/component/input/Password'
import { connect } from 'react-redux';
import { submitLogin } from '../../actions/userAction'
import * as Yup from "yup";
import ConfirmBtn from '../../common/component/button/ConfirmBtn';

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
                <AccountForm model={user}
                    onSubmit={(user) => this.handleSubmit(user)}
                    validationSchema={Yup.object().shape({
                        password: Yup.string()
                            .matches(/[a-zA-Z]/, 'password can only contain Latin letters.')
                            .required('Required')
                            .min(4, 'password is too short!')
                            .max(15,'password is too long!')
                            ,
                        user_id: Yup.string()
                            .min(3, 'id is too short')
                            .max(10, 'id is too long')
                            .matches(/[a-zA-Z]/, 'user_id can only contain Latin letters.')
                            .required('Required'),
                    })}
                >
                     <h1 id="websiteTitle">FOUNDARY</h1>
                    <Text
                        placeholder='USERNAME'
                        type="text"
                        name="user_id"
                    />
                    <br />
                    <Password
                        placeholder='PASSWORD'
                        type="password"
                        name="password"
                    />

                    <ConfirmBtn displayName='login!' />

                </AccountForm>
            </div>
        )

    }
}

export default Login;

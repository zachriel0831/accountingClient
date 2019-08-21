import React from 'react';
import Text from '../../common/component/input/Text'
import Number from '../../common/component/input/Number'
import AccountForm from '../../common/component/formcore/AccountForm';
import Password from '../../common/component/input/Password'
import { connect } from 'react-redux';
import { subscribeUser } from '../../actions/userAction'
import * as Yup from "yup";
import ConfirmBtn from '../../common/component/button/ConfirmBtn';

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
                phone:user.phone
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
                                password:Yup.string()
                                .matches(/[a-zA-Z]/, 'password can only contain Latin letters.')
                                .required('Required')
                                .min(4,'password is too short'),
                                user_id: Yup.string()
                                .min(3, 'id is too short')
                                .matches(/[a-zA-Z]/, 'user_id can only contain Latin letters.')
                                .required('Required'),
                                phone: Yup.string()
                                .min(10,'phone is too short')
                                .matches(/^[0-9]*$/,'can only type number!')
                            })}
                >
                    <h1>this is subscribe page</h1>

                    <label htmlFor="user_id">id:</label>
                    <Text
                        placeholder='please type your id'
                        type="id"
                        name="user_id"
                        maxlength={10}
                        required
                    />
                    <Password
                        placeholder='PASSWORD'
                        type="password"
                        name="password"
                    />
                    <Number
                        placeholder='PHONE'
                        name="phone"                    
                    />
                    <Text
                        placeholder='NAME'
                        type="name"
                        name="name"
                    />
                    <Text
                        type="email"
                        name="email"
                        onChange={(e) => this.customOnchange(e)}
                        // onBlur={(e) => this.onEmailBlur(e)}
                        placeholder="EMAIL"
                    />

                    <ConfirmBtn displayName='Subscribe!' />

                </AccountForm>
            </div>
        )

    }
}

export default RegisterPage;

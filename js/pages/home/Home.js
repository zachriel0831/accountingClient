import React from 'react';
import { connect } from 'react-redux';
import { fetchAction } from '../../actions/fetchAction';
import Text from '../../common/component/input/Text';
import Select from '../../common/component/input/Select';
import AccountSelect from '../../common/component/input/AccountSelect';
import Amount from '../../common/component/input/Amount';
import AccountForm from '../../common/component/formcore/AccountForm';
import RadioBtn from '../../common/component/input/RadioBtn';
import * as Yup from "yup";
import TxnHOC from '../../common/utils/TxnHOC'
import model from '../../model/index';
import Table from '../../common/component/view/Table'

@connect((store) => {

    return {
        userReducer: store.userReducer,
        accountingReducer: store.accountingReducer,
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
        if (data.username === undefined || data.token === undefined) {
            window.location.hash = '/Login'
            this.props.dispatch({
                type: 'USER_LOGOUT',
            })
        }
    }

    componentDidUpdate(prevProps, preState) {
    }



    componentDidMount() {
        

    }

    selectCategory(e, val) {
        // this.setState({
        //     branchGroupKey: val,
        // })
    }

    renderTable(data) {

        console.log(data);
    }

    handleSubmit(requestData) {
        console.log(requestData);
        let date = new Date();

        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        requestData.displayDay = day;
        requestData.displayMonth = month;
        requestData.displayYear = year;

        this.props.submitToServer(requestData, '/account/newAccounting', 'NEW_ACCOUNT', this.renderTable);
    }

    render() {
        console.log(this.props)

        const { userDetail } = this.props.userReducer;
        let { accountDetail } = this.props.userReducer;
        if (accountDetail !== '' && accountDetail.length === 0) {
            accountDetail = '';
        }
        let userName = (userDetail) ? userDetail[0].name : '';
        let accounts = (accountDetail) ? accountDetail : [];

        if (this.props.accountingReducer.accountDetail.length !== 0) {
            accounts = this.props.accountingReducer.accountDetail;
        }

        return (
            <div style={{ display: userName !== '' ? 'block' : 'none' }}>
                <AccountForm
                    model={model.accounting.accounting}
                    onSubmit={(v) => this.handleSubmit(v)}
                    validationSchema={Yup.object().shape({
                    })}
                >


                    <RadioBtn name="sourceFlag" value='expenditure' label='expenditure' />

                    <RadioBtn name="sourceFlag" value='income' label='income' />

                    <Select name="category" value={CATEGORY} defaultOption='choose category' onChange={(e, val) => this.selectCategory(e, val)} />

                    Amount:<Amount
                        name="amount"
                        placeholder="please type your amount"
                    />
                    item name: <Text name="itemName" placeholder="item Name" />

                    Remark: <Text name="remark" placeholder="remark" />


                    <button className="btn btn-primary" type="submit">
                        送出
                    </button>

                </AccountForm >
                <Table columnData={accounts} {...this.props} />

            </div>
        )

    }
}

export default TxnHOC(Home);

import React from 'react';
import Text from '../../common/component/input/Text';
import Select from '../../common/component/input/Select';
import AccountSelect from '../../common/component/input/AccountSelect';
import Amount from '../../common/component/input/Amount';
import AccountForm from '../../common/component/formcore/AccountForm';
import RadioBtn from '../../common/component/input/RadioBtn';
import { connect } from 'react-redux';
import * as Yup from "yup";
import TxnHOC from '../../common/utils/TxnHOC'
import model from '../../model/index';

@connect((store) => {
    return {
        ntdTransfer_initData: store.ntdTransferReducer.ntdTransfer_Props,
    };
})
class NtdTransfer_1 extends React.Component {
    constructor(props) {
        super(props);
        this.txnId = "NtdTransfer";
		this.pageId = "NtdTransfer_1";

        this.state = {
            branchGroupKey: '',
        }
    }

    componentDidUpdate(prevProps, preState) {

    }



    componentDidMount() {

    }

    selectBranch(e, val) {
        this.setState({
            branchGroupKey: val,
        })
    }

    handleSubmit(requestData) {
        console.log(requestData);
        let data = 
            {
                trnAcct: requestData.trnAcct,
                trnType: requestData.trnType,
                amount: requestData.amount,
                remark: requestData.remark,
            }

        this.props.submitToServer(data, this.txnId, this.pageId,'NtdTransfer_2');
    }

    render() {
        console.log(this.props)
        const initData  = this.props.ntdTransfer_initData;
        return (

            <div>
                <AccountForm
                    model={model.ntdTransfer_1_requestData}
                    onSubmit={(model) => this.handleSubmit(model)}
                    validationSchema={
                        Yup.object().shape({
                            trnType: Yup.string()
                                .required('Required'),
                            trnAcct: Yup.string()
                                .required('Required'),
                            amount: Yup.string()
                                .matches(/^[0-9]*$/, 'can only accept numbers')
                                .required('Required'),

                        })}

                >

                    <h1>this is transferPage</h1>

                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">帳號:{initData.userAccount}</h5>
                            <p></p>
                            <h5 className="card-title">存款餘額:{initData.balance}</h5>

                            <p className="card-text">您還有{initData.free}次的免費轉帳</p>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-body">

                            <span>
                                選擇您要轉入的帳號
                            </span>
                            <RadioBtn name="trnType" value='transfer' label='即時轉帳' />

                            {/* <RadioBtn name="trnType" value='Wire_transfer' label='預約轉帳' /> */}
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-body">
                            <span>
                                選擇您要轉入的帳號
                            </span>
                            <Select name="branch" value={initData.branch} defaultOption='選擇銀行' onChange={(e, val) => this.selectBranch(e, val)} />
                            <div style={{ display: this.state.branchGroupKey === '' ? 'none' : 'block' }}>
                                <AccountSelect name="trnAcct" value={initData.accountList} defaultOption='選擇帳號' groupKey={this.state.branchGroupKey} />
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-body">
                            <span>
                                $NTD:
                            </span>

                            <Amount
                                name="amount"
                                placeholder="please type your amount"
                            />
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-body">

                            <Text name="remark" placeholder="附註" />
                        </div>
                    </div>
                    <button className="btn btn-primary" type="submit">
                        下一頁
                    </button>

                </AccountForm >

            </div >
        )

    }
}

export default TxnHOC(NtdTransfer_1);

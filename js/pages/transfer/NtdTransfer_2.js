import React from 'react';
import AccountForm from '../../common/component/formcore/AccountForm';
import { connect } from 'react-redux';
import * as Yup from "yup";
import model from '../../model/index';
import OTPPanel from '../../common/component/security/OTPPanel'
import TxnHOC from '../../common/utils/TxnHOC';


@connect((store) => {
    return {
        resultData: store.ntdTransferReducer.ntdTransfer_Props
    };
})
class NtdTransfer_2 extends React.Component {
    constructor(props) {
        super(props);
        this.txnId = "NtdTransfer";
		this.pageId = "NtdTransfer_2";
        this.state = {
        }
    }

    componentDidUpdate(prevProps, preState) {
    }



    componentDidMount() {

    }

    handleSubmit(requestData) {

        let data =
        {
            otpCode: requestData.otpCode,
        }


        this.props.submitToServer(data, this.txnId, this.pageId, 'NtdTransfer_3');
    }

    render() {
        let resultData = this.props.resultData;

        return (
            <div>
                <AccountForm
                    ref='ntdTransfer_2'
                    model={model.ntdTransfer_2_requestData}
                    onSubmit={(requestData) => this.handleSubmit(requestData)}
                    validationSchema={Yup.object().shape({
                        otpCode: Yup.number()
                            .required('Required')
                    })}
                >

                    <h1>this is transferPage 2</h1>
                    <OTPPanel name='otpCode' maxlength={4} securityParam={resultData.securityParam} />
                    <button className="btn btn-primary" type="submit">
                        下一頁
                    </button>
                </AccountForm >

            </div >
        )

    }
}

export default TxnHOC(NtdTransfer_2);

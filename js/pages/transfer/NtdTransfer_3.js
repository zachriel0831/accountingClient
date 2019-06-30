import React from 'react';
import AccountForm from '../../common/component/formcore/AccountForm';
import { connect } from 'react-redux';
import * as Yup from "yup";
import TxnHOC from '../../common/utils/TxnHOC';
import Table from '../../common/component/view/Table'
@connect((store) => {
    return {
        resultData: store.ntdTransferReducer.ntdTransfer_Props
    };
})
class NtdTransfer_3 extends React.Component {
    constructor(props) {
        super(props);
        this.txnId = "NtdTransfer";
        this.pageId = "NtdTransfer_3";

        this.state = {
        }
    }

    componentDidUpdate(prevProps, preState) {
    }



    componentDidMount() {

    }

    handleSubmit() {

        let data = {}

        this.props.submitToServer(data, this.txnId, this.pageId,'ntdTransfer_4_Rst');

    }

    render() {
        let resultData = this.props.resultData
        return (
          
            <div>
                <AccountForm
                    model={{}}
                    onSubmit={() => this.handleSubmit()}
                    validationSchema={Yup.object().shape({
                    })}

                >

                    <h1>this is transferPage 3</h1>
                    <Table columnData={resultData}/>
                    <button className="btn btn-primary" type="submit">
                        下一頁
                    </button>


                </AccountForm >

            </div >
        )

    }
}

export default TxnHOC(NtdTransfer_3);

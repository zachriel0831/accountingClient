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
class NtdTransfer_4 extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    componentDidUpdate(prevProps, preState) {
    }



    componentDidMount() {

    }

    handleSubmit(userAccount) {

        window.location.hash = '/Home'

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

                    <h1>this is transferPage 4 final page</h1>
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">轉帳完成！！！</h5>                  
                        </div>
                    </div>

                    <Table columnData={resultData}/>
                    
                    <button className="btn btn-primary" type="submit">
                        完成
                    </button>
                </AccountForm >

            </div >
        )
    }
}

export default TxnHOC(NtdTransfer_4);

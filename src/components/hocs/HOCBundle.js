import React, { Suspense } from 'react';
// import AjaxWrapper from '../utils/AjaxWrapper';
// import utils from '../util/utils';
// import config from '../../configs/config'
// import { TxnContextProvider } from '../../../contexts/TxnContext';
// import { RoutingCheckerLayer } from './RoutingCheckerLayer';
import { Dimmer, Loader } from 'semantic-ui-react';
// import SystemAlertMessageModal from '../SystemAlertMessageModal';
// import CommonAlertMessageModal from '../CommonAlertMessageModal';
import _ from 'lodash';
// import { useIndexedDB } from 'react-indexed-db';

const HOCBundle = (WrappedComponent) => {
    return class extends React.PureComponent {
        constructor(props) {
            super(props);
            this.state = {
                // result: this.getInitData(),
                resetKey: Math.random(),
            };

        }
        // getInitData() {

        //     //TODO 
        //     const { getAll } = useIndexedDB('Accountings');
        //     getAll().then(Accountings => {


        //       });

        //     console.log('getInitData');

        // }

        setAlertMsg = (errors) => {
            this.refs.alertThis.openModal(errors)
        }
        closeAlertMsg = () => {
            this.refs.alertThis.closeModal()

        }

        setCommonMsg = (msg, refreshWhenClose) => {
            this.refs.commonAlert.openModal(msg, refreshWhenClose);
        }

        closeCommonMsg = () => {
            this.refs.commonAlert.closeModal();
        }

        resetKey = () => {
            this.setState({
                resetKey: Math.random(),
            })
        }
        componentDidUpdate(prevProps, preState) {
        }

        render() {
            // let result = this.state.result;
            // let current_page = (window.location.hash).replace('#', '');

            //錯誤頁要能通過
            // let releaseList = ['/Errors/CommonErrorPage', '/Errors/SystemErrorPage'];
            // let releaseResult = releaseList.indexOf(current_page);
            // let _this = this;
            let customerFunc = {
                // submitFormToSerevr: async (url, values, callback) => {

                // },
                // queryDataFromServer: async (url, values, callback) => {

                // },
                // gotoPage: () => {
                //     //TODO
                // },

                resetKey: () => {
                    this.resetKey()
                },
                reloadPage: () => {
                    window.location.reload();
                }
            }

            //TODO沒有responseData的話查看放行清單, 錯誤頁仍需render元件
            // if (result) {

            return (
                <>
                    <Suspense fallback={
                        <div className="sys__main__wrap">
                            <Dimmer active={true} inverted>
                                <Loader>Loading</Loader>
                            </Dimmer></div>
                    }>
                        <WrappedComponent key={this.state.resetKey} {...this.props} {...customerFunc} alert={this.setAlertMsg} alertCommonMsg={(msg, refreshWhenClose) => this.setCommonMsg(msg, refreshWhenClose)} />
                        {/* <SystemAlertMessageModal headerTitle='Information' ref='alertThis' />
                            <CommonAlertMessageModal ref='commonAlert' /> */}

                    </Suspense>
                </>)
            // } else {
            //     return (
            //         <>Loading...</>
            //     )
            // }
        }
    };
}

export default HOCBundle;
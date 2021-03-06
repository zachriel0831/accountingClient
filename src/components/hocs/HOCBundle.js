import React, { Suspense } from 'react';
// import AjaxWrapper from '../utils/AjaxWrapper';
import utils from '../../utils/utils';
import config from '../../configs/config'
// import { TxnContextProvider } from '../../../contexts/TxnContext';
// import { RoutingCheckerLayer } from './RoutingCheckerLayer';
import { Dimmer, Loader } from 'semantic-ui-react';
// import SystemAlertMessageModal from '../SystemAlertMessageModal';
// import CommonAlertMessageModal from '../CommonAlertMessageModal';
import _ from 'lodash';
import { useIndexedDB } from 'react-indexed-db';
import moment from 'moment';
import axios from 'axios';

const HOCBundle = (WrappedComponent) => {
    return class extends React.PureComponent {

        constructor(props) {
            super(props);
            this.state = {
                result: {},
                resetKey: Math.random(),
            };
            let current_page = (window.location.hash).replace('#/', '');
            
            switch (current_page) {
                case 'Currency':
                    this.getCurrencyInitData();
                    console.log('curency page');

                    break;
                case 'BackUp':
                    console.log('back up page');
                    this.getInitData();

                    break;

                default:
                    this.getInitData();

                    break;
            }

        }
        async getInitData() {
            const { getAll } = useIndexedDB('Accountings');
            let _this = this;
            //TODO 
            await getAll().then(AccountingData => {
                let accountQueriesData = {};

                accountQueriesData.queries = AccountingData;
                accountQueriesData.time = moment().format('YYYY/MM/DD MM:SS');
                accountQueriesData.count = AccountingData.length;
                console.log('getInitData');

                _this.setState({
                    result: accountQueriesData
                })

            });
        }

        async getCurrencyInitData() {
            // const { getAll } = useIndexedDB('Accountings_Currencies');
            // let _this = this;
            // //TODO 
            // await getAll().then(AccountingData => {
            //     let accountQueriesData = {};

            //     accountQueriesData.queries = AccountingData;
            //     accountQueriesData.time = moment().format('YYYY/MM/DD MM:SS');
            //     accountQueriesData.count = AccountingData.length;
            //     console.log('getCurrencyInitData');

            //     _this.setState({
            //         result: accountQueriesData
            //     })

            // });
            let _this = this;

            await axios({
                method: 'get',
                baseURL: config.mode === 0 ? config.crawlingLocalService : config.crawlerService,
                url: '/currency/get_currency',
                'Content-Type': 'application/json',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
                withCredentials: false,
            }).then(function (response) {
                let responseData = response.data;

                console.log(response);
                _this.setState({
                    result: responseData.data
                })
                // handle success
            }).catch(function (error) {
                // handle error
                console.log(error);
                alert('git currency failed!')

            }).finally(function () {
                console.log('request finished');

            });

        }

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
                },
                getMonthlyData: (queryState, month) => {
                    let monthlyIncome = 0;
                    let monthlyExpenditure = 0;
                    let result = {};
                    let year = moment().format('YYYY');
                    let monthlyDatas = queryState.queries.filter((items, index, array) => {

                        return items.month === month && items.year === year;
                    });

                    _.each(monthlyDatas, (v, k) => {
                        if (v.type === 'expenditure') {
                            monthlyExpenditure += parseInt(v.amount);

                        } else if (v.type === 'income') {
                            monthlyIncome += parseInt(v.amount);
                        }
                    });

                    result.monthlyExpenditure = utils.transferToAmountFormat(monthlyExpenditure);
                    result.monthlyIncome = utils.transferToAmountFormat(monthlyIncome);
                    result.monthlyBalance = utils.transferToAmountFormat((monthlyIncome - monthlyExpenditure));
                    result.monthlyDatas = monthlyDatas;
                    return result;
                },
                getAnnualData: (queryState, year) => {
                    let annualIncome = 0;
                    let annualExpenditure = 0;
                    let result = {};
                    let annualDatas = queryState.queries.filter((items, index, array) => {

                        return items.year === year;
                    });

                    _.each(annualDatas, (v, k) => {
                        if (v.type === 'expenditure') {
                            annualExpenditure += parseInt(v.amount);

                        } else if (v.type === 'income') {
                            annualIncome += parseInt(v.amount);
                        }
                    });

                    result.annualExpenditure = utils.transferToAmountFormat(annualExpenditure);
                    result.annualIncome = utils.transferToAmountFormat(annualIncome);
                    result.annualBalance = utils.transferToAmountFormat((annualIncome - annualExpenditure));
                    result.annualDatas = annualDatas;
                    return result;
                },
                getTotalData: (queryState) => {
                    let result = {}

                    let totalIncome = 0;
                    let totalExpenditure = 0;

                    _.each(queryState.queries, (v, k) => {
                        if (v.type === 'expenditure') {
                            totalExpenditure += parseInt(v.amount);

                        } else if (v.type === 'income') {
                            totalIncome += parseInt(v.amount);
                        }
                        // console.log(v);
                    });
                    result.totalExpenditure = utils.transferToAmountFormat(totalExpenditure);
                    result.totalIncome = utils.transferToAmountFormat(totalIncome);
                    result.totalAssets = utils.transferToAmountFormat((totalIncome - totalExpenditure));

                    return result;
                },
                getHomeOptions:(categoryDB)=>{
                    let categories = config.categories;
                    let categoryBox = [];
                    _.each(categories, (v, k) => {
                        let items = {
                            label: v,
                            value: v
                        }
                        categoryBox.push(items);
                    });
            
                    categoryDB.getAll().then(categories => {
                        _.each(categories, (v, k) => {
                            let items = {
                                label: v.name,
                                value: v.name
                            }
                            categoryBox.push(
                                items
                            );
                        });
            
                        const options = {
                            "seletedValue": "",
                            "disabled": false,
                            "items": [...categoryBox]
                        };
            
                        return options;
                    });
                }
            }

            //TODO沒有responseData的話查看放行清單, 錯誤頁仍需render元件
            // if (result) {
            let results = this.state.result;
            

            if (!_.isEmpty(results)) {
                return (
                    <>
                        <Suspense fallback={
                            <div className="sys__main__wrap">
                                <Dimmer active={true} inverted>
                                    <Loader>Loading</Loader>
                                </Dimmer></div>
                        }>
                            <WrappedComponent key={this.state.resetKey} {...this.props} {...customerFunc} alert={this.setAlertMsg} initialState={this.state.result} alertCommonMsg={(msg, refreshWhenClose) => this.setCommonMsg(msg, refreshWhenClose)} />
                            {/* <SystemAlertMessageModal headerTitle='Information' ref='alertThis' />
                            <CommonAlertMessageModal ref='commonAlert' /> */}

                        </Suspense>
                    </>)
            } else {

                return <div className="sys__main__wrap">
                    <Dimmer active={true} inverted>
                        <Loader>Loading</Loader>
                    </Dimmer></div>
            }

        }
    };
}

export default HOCBundle;
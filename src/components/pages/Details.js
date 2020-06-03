
import React, { useState, useEffect, useRef } from 'react';
import { useIndexedDB } from 'react-indexed-db';
import Form from '../Form';
// import Text from '../Text';
// import Amount from '../Amount';
import RadioGroup from '../RadioGroup';
import Select from '../Select'
import useForm from '../custom-hooks/useForm';
import _ from 'lodash';
import config from '../../configs/config';
import Button from '../Button';
import { useTranslation } from "react-i18next";
import moment from 'moment';
import AccountingTable from '../AccountingTable';
import DatePicker from '../DatePicker';
import PureCheckBox from '../PureCheckBox';
// import { Modal } from 'semantic-ui-react';
// import EditPanel from '../modals/EditPanel';
import validateThis from '../../validationSet/validations';
import utils from '../../utils/utils';
import { Segment, Divider, Radio } from 'semantic-ui-react';

const radioGroupItem = {
    "items": [{
        "label": "show all",
        "value": "all",
        "groupKey": "_none",
        "disabled": false
    }, {
        "label": "expenditure",
        "value": "expenditure",
        "groupKey": "_none",
        "disabled": false
    },
    {
        "label": "income",
        "value": "income",
        "groupKey": "_none",
        "disabled": false
    },
    ],
    "selectedValue": "all"
}

const dataFilterRadioGroupItem = {
    "items": [
        {
            "label": "this month",
            "value": "month",
            "groupKey": "_none",
            "disabled": false
        }, {
            "label": "this year",
            "value": "year",
            "groupKey": "_none",
            "disabled": false
        },
        {
            "label": "certain day",
            "value": "certain_day",
            "groupKey": "_none",
            "disabled": false
        },
        {
            "label": "period",
            "value": "period",
            "groupKey": "_none",
            "disabled": false
        },
        {
            "label": "byYear",
            "value": "byYear",
            "groupKey": "_none",
            "disabled": false
        },

    ],
    "selectedValue": "month"
}
// let categories = config.categories;
// let categoryBox = [];

// _.each(categories, (v, k) => {
//     let items = {
//         label: v,
//         value: v
//     }
//     categoryBox.push(items);
// });

// const selectOptions = {
//     "seletedValue": "",
//     "disabled": false,
//     "items": [...categoryBox]
// };

const yearSelectOptions = {
    "seletedValue": moment(new Date()).format('YYYY'),
    "disabled": false,
    "items": [...(utils.initialYearOptions())]
};

const Details = (props) => {
    const [optionsState, setOptionState] = useState({});
    const { deleteRecord, getAll } = useIndexedDB('Accountings');
    const categoryDB = useIndexedDB('Accountings_Categories');

    const { t } = useTranslation();

    let radioBtnInitVal = [];
    if (radioGroupItem) {
        _.each(radioGroupItem.items, (v, k) => {
            if (v.value === radioGroupItem.selectedValue) {
                radioBtnInitVal.push(v.value);
            }
        })
    }


    let dataFilterRadioBtnInitVal = [];
    if (dataFilterRadioGroupItem) {
        _.each(dataFilterRadioGroupItem.items, (v, k) => {

            if (v.value === dataFilterRadioGroupItem.selectedValue) {
                dataFilterRadioBtnInitVal.push(v.value);
            }
        })
    }

    // const { getAll } = useIndexedDB('Accountings');
    // const { t } = useTranslation();
    // const _this = this;
    const initialState = props.initialState;

    const [dimmerState, setDimmerState] = useState(false);
    const [selectAllState, setSelectAllState] = useState(false);
    const [checkBoxListState, setCheckBoxListState] = useState([]);
    const [dateState, setDateState] = useState(new Date());
    const [endDateState, setEndDateState] = useState(new Date());

    const [startDateState, setStartDateState] = useState(new Date());

    const [allDataState,setAllDataState] = useState(initialState);
    const [queriesState, setQueriesState] = useState({});
    const [displayBalanceState, setDisplayBalanceState] = useState('none');

    const [countYearState, setCountYearState] = useState(moment(new Date()).format('YYYY').toString());
    const [countMonthState, setCountMonthState] = useState(moment(new Date()).format('MM').toString());


    const [assetsDetailState, setAssetsDetailsState] = useState({
        monthlyIncomeState: 0,
        monthlyExpenditureState: 0,
        monthlyBalance: 0,
        monthlyDatas: [],
        annualIncomeState: 0,
        annualExpenditureState: 0,
        annualBalance: 0,
        annualDatas: [],
        totalIncomeState: 0,
        totalExpenditureState: 0,
        totalAssets: 0,
        incomeSummary: 0,
        expenditureSummary: 0
    })

    const [dataFilterRadioGroupState, setDataFilterRadioGroupState] = useState(dataFilterRadioBtnInitVal[0]);
    const [radioGroupState, setRadioGroupState] = useState(radioBtnInitVal[0]);
    const initFormState = {
        year: moment(new Date()).format('YYYY'),

    };


    const { values, handleChange, handleSubmit, handleReset } = useForm(resetForm, submit, initFormState);

    function resetForm() {
    }

    function submit(e, formRef) {

        let category = values.category;
        let type = radioGroupState;
        let date = moment(dateState).format('YYYY/MM/DD');
        // let month = moment(dateState).format('MM');
        // let day = moment(dateState).format('DD');
        // let year = moment(dateState).format('YYYY');

        let startDate = moment(startDateState).format('YYYY/MM/DD');
        // let startMonth = moment(startDateState).format('MM');
        // let startYear = moment(startDateState).format('YYYY');
        // let startDay = moment(startDateState).format('DD');


        let endDate = moment(endDateState).format('YYYY/MM/DD');
        // let endMonth = moment(endDateState).format('MM');
        // let endYear = moment(endDateState).format('YYYY');
        // let endDay = moment(endDateState).format('DD');

        let accountQueriesData = {};
        let sumIncome = 0;
        let sumExpenditure = 0;

        switch (dataFilterRadioGroupState) {
            case 'month':
                accountQueriesData.queries = [...assetsDetailState.monthlyDatas];


                accountQueriesData.queries = accountQueriesData.queries.filter((items, index, array) => {

                    return ((category) ? (items.category === category) : true) && (!(type === 'all') ? (items.type === type) : true);
                });

                break;

            case 'year':


                accountQueriesData.queries = [...assetsDetailState.annualDatas];

                accountQueriesData.queries = accountQueriesData.queries.filter((items, index, array) => {

                    return ((category) ? (items.category === category) : true) && (!(type === 'all') ? (items.type === type) : true);
                });

                break;

            case 'certain_day':
                accountQueriesData.queries = allDataState.filter((items, index, array) => {

                    return (items.date === date) && ((category) ? (items.category === category) : true) && (!(type === 'all') ? (items.type === type) : true);
                });

                break;

            case 'period':
                accountQueriesData.queries = allDataState.filter((items, index, array) => {

                    return moment(items.date).isAfter(startDate) && moment(items.date).isBefore(endDate) && ((category) ? (items.category === category) : true) && (!(type === 'all') ? (items.type == type) : true);
                });

                break;

            case 'byYear':
                accountQueriesData.queries = allDataState.filter((items, index, array) => {

                    return items.year === values.year && ((category) ? (items.category === category) : true) && (!(type === 'all') ? (items.type === type) : true);
                });

                break;
            default:
                break;
        }

        _.each(accountQueriesData.queries, (v, k) => {
            if (v.type === 'expenditure') {
                sumExpenditure += parseInt(v.amount);
            } else {
                sumIncome += parseInt(v.amount);
            }
        });


        // accountQueriesData.queries = [...initialState.queries];
        accountQueriesData.count = accountQueriesData.queries.length;
        accountQueriesData.time = moment().format('YYYY/MM/DD MM:SS');
        accountQueriesData.incomeSummary = sumIncome;
        accountQueriesData.expenditureSummary = sumExpenditure;

        setQueriesState(accountQueriesData);

    }

    const getAllData = () => {

        getAll().then(AccountingData => {
            let accountQueriesData = {};

            accountQueriesData.queries = AccountingData;
            accountQueriesData.time = moment().format('YYYY/MM/DD MM:SS')
            accountQueriesData.count = AccountingData.length;

            setAllDataState(AccountingData);

            let thisYear = moment().format('YYYY');
            let thisMonth = moment().format('MM');

            let monthlyResult = props.getMonthlyData(accountQueriesData, thisMonth);

            let annualResult = props.getAnnualData(accountQueriesData, thisYear);

            let totalAssetsResult = props.getTotalData(accountQueriesData);

            setAssetsDetailsState(
                {
                    monthlyIncomeState: monthlyResult.monthlyIncome,
                    monthlyExpenditureState: monthlyResult.monthlyExpenditure,
                    monthlyBalance: monthlyResult.monthlyBalance,
                    monthlyDatas: monthlyResult.monthlyDatas,
                    annualIncomeState: annualResult.annualIncome,
                    annualExpenditureState: annualResult.annualExpenditure,
                    annualBalance: annualResult.annualBalance,
                    annualDatas: annualResult.annualDatas,
                    totalIncomeState: totalAssetsResult.totalIncome,
                    totalExpenditureState: totalAssetsResult.totalExpenditure,
                    totalAssets: totalAssetsResult.totalAssets,
                }
            )

            let category = values.category;
            let type = radioGroupState;
            let date = moment(dateState).format('YYYY/MM/DD');
            // let month = moment(dateState).format('MM');
            // let day = moment(dateState).format('DD');
            // let year = moment(dateState).format('YYYY');

            let startDate = moment(startDateState).format('YYYY/MM/DD');
            // let startMonth = moment(startDateState).format('MM');
            // let startYear = moment(startDateState).format('YYYY');
            // let startDay = moment(startDateState).format('DD');


            let endDate = moment(endDateState).format('YYYY/MM/DD');
            // let endMonth = moment(endDateState).format('MM');
            // let endYear = moment(endDateState).format('YYYY');
            // let endDay = moment(endDateState).format('DD');

            let sumIncome = 0;
            let sumExpenditure = 0;

            switch (dataFilterRadioGroupState) {
                case 'month':
                    accountQueriesData.queries = [...monthlyResult.monthlyDatas];


                    accountQueriesData.queries = accountQueriesData.queries.filter((items, index, array) => {

                        return ((category) ? (items.category === category) : true) && (!(type === 'all') ? (items.type === type) : true);
                    });

                    break;

                case 'year':


                    accountQueriesData.queries = [...annualResult.annualDatas];

                    accountQueriesData.queries = accountQueriesData.queries.filter((items, index, array) => {

                        return ((category) ? (items.category === category) : true) && (!(type === 'all') ? (items.type === type) : true);
                    });


                    break;

                case 'certain_day':
                    accountQueriesData.queries = allDataState.filter((items, index, array) => {

                        return (items.date === date) && ((category) ? (items.category === category) : true) && (!(type === 'all') ? (items.type === type) : true);
                    });

                    break;

                case 'period':
                    accountQueriesData.queries = accountQueriesData.queries.filter((items, index, array) => {

                        return moment(items.date).isAfter(startDate) && moment(items.date).isBefore(endDate) && ((category) ? (items.category === category) : true) && (!(type === 'all') ? (items.type == type) : true);
                    });


                    break;

                case 'byYear':
                    accountQueriesData.queries = accountQueriesData.queries.filter((items, index, array) => {

                        return items.year === values.year && ((category) ? (items.category === category) : true) && (!(type === 'all') ? (items.type === type) : true);
                    });

                    break;
                default:
                    break;
            }

            _.each(accountQueriesData.queries, (v, k) => {
                if (v.type === 'expenditure') {
                    sumExpenditure += parseInt(v.amount);
                } else {
                    sumIncome += parseInt(v.amount);
                }
            });

            accountQueriesData.count = accountQueriesData.queries.length;
            accountQueriesData.time = moment().format('YYYY/MM/DD MM:SS');
            accountQueriesData.incomeSummary = sumIncome;
            accountQueriesData.expenditureSummary = sumExpenditure;

            setQueriesState(accountQueriesData);
        });
    }

    useEffect(() => {
        getAllData();

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

            setOptionState(options);

        });

    }, []);

    const selectAllCheckBox = (e) => {
        setSelectAllState(!selectAllState);
    }
    const deleteItems = (e) => {
        _.each(checkBoxListState, (v, k) => {
            let id = v[0];
            deleteRecord(id).then(event => {
                console.log('Deleted!');
            });

        });

        props.resetKey();
    }
    const selectedCheckBoxClick = (e, val, checked, checkedTarget) => {

        if (checked) {
            checkBoxListState.push(val);

            setCheckBoxListState(checkBoxListState);

        } else {

            let newArray = checkBoxListState.filter(function (item, index, array) {
                console.log(item[0]);

                return checkedTarget[0] !== item[0];
            });
            // checkBoxListState = [...newArray];
            setCheckBoxListState(newArray);

        }
    }

    const getAllCheckBoxVal = (val) => {


        if (_.isEmpty(val)) {
            checkBoxListState.splice(0, checkBoxListState.length)

            setCheckBoxListState(checkBoxListState);
            return;
        }
        checkBoxListState.push(...val);
        setCheckBoxListState(checkBoxListState);
        console.log('getAllcheckBoxVal ', val);
    }

    const previousBtnClick = (e) => {
        let accountQueriesData = {};
        let previousMonth = parseInt(countMonthState) - 1;
        let previousYear = countYearState;
        let sumIncome = 0;
        let sumExpenditure = 0;

        if (previousMonth === 0) {
            previousYear = parseInt(countYearState) - 1;
            setCountYearState(previousYear);
            previousMonth = '12';
        } else {
            previousMonth = (previousMonth < 10) ? '0' + previousMonth : previousMonth
        }
        setCountMonthState(previousMonth);

        accountQueriesData.queries = allDataState.filter((items, index, array) => {

            return (items.year === previousYear) && (items.month === previousMonth);
        });

        _.each(accountQueriesData.queries, (v, k) => {
            if (v.type === 'expenditure') {
                sumExpenditure += parseInt(v.amount);
            } else {
                sumIncome += parseInt(v.amount);
            }
        });

        accountQueriesData.count = accountQueriesData.queries.length;
        accountQueriesData.time = moment().format('YYYY/MM/DD MM:SS');
        accountQueriesData.incomeSummary = sumIncome;
        accountQueriesData.expenditureSummary = sumExpenditure;
        accountQueriesData.displayDate = { year: previousYear, month: previousMonth };

        setQueriesState(accountQueriesData);
    }

    const nextBtnClick = (e) => {
        let accountQueriesData = {};
        let nextMonth = parseInt(countMonthState) + 1;
        let nextYear = countYearState;
        let sumIncome = 0;
        let sumExpenditure = 0;

        if (nextMonth === 13) {
            nextYear = parseInt(countYearState) + 1;
            setCountYearState(nextYear);
            nextMonth = '01';
        } else {
            nextMonth = (nextMonth < 10) ? '0' + nextMonth : nextMonth

        }
        setCountMonthState(nextMonth);

        accountQueriesData.queries = allDataState.filter((items, index, array) => {

            return (items.year === nextYear) && (items.month === nextMonth);
        });

        _.each(accountQueriesData.queries, (v, k) => {
            if (v.type === 'expenditure') {
                sumExpenditure += parseInt(v.amount);
            } else {
                sumIncome += parseInt(v.amount);
            }
        });
        accountQueriesData.count = accountQueriesData.queries.length;
        accountQueriesData.time = moment().format('YYYY/MM/DD MM:SS');
        accountQueriesData.incomeSummary = sumIncome;
        accountQueriesData.expenditureSummary = sumExpenditure;
        accountQueriesData.displayDate = { year: nextYear, month: nextMonth };


        setQueriesState(accountQueriesData);

    }

    let headerSpec = {
        header: [
            { id: 'id', headerName: 'id', style: { display: 'none' } },
            { id: 'type', headerName: 'type' },
            { id: 'category', headerName: 'category' },
            { id: 'amount', headerName: 'amount' },
            { id: 'date', headerName: 'date' },
            { id: 'remark', headerName: 'remark' },

        ],
        selectable: true, //開啟checkbox
        selectableDisplayName: { id: 'select', headerName: 'check' },
        onCheckBoxClick: selectedCheckBoxClick,
        getAllCheckBoxVal: (val) => getAllCheckBoxVal(val),
        amountSortingHeaderKey: ["amount"],
        // requestDataHeaderKey: [ "num", "msg_num" ]
    }

    let columnSpec = [
        {
            header: 'id',
            style: { display: 'none' },
        }
    ];

    const doubleClick = (e, trValues) => {
        console.log('click row data: ', trValues);

    }

    let rowSpec = {
        // selectedValue: true,
        selectedValue: false,
        queryUrl: '/',
        method: 'POST',
        requestDataKey: 'id',
        customOnRowDoubleClick: doubleClick,
    }


    return <><Form title='Details' onSubmit={handleSubmit} onReset={handleReset} toggleDimmer={dimmerState}>
        <Segment>
            <div className="input-group">
                <RadioGroup
                    name='data filter'
                    radioData={dataFilterRadioGroupItem}
                    onClick={(val) => {
                        setDataFilterRadioGroupState(val)
                    }} />
            </div>

            <div className="input-group">
                <RadioGroup
                    name='type'
                    radioData={radioGroupItem}
                    onClick={(val) => {
                        setRadioGroupState(val)
                    }} />
            </div>
            <div className="input-group">
                <Select value={values.category} name='category' label='category' options={optionsState} onChange={handleChange} />
            </div>

            <div className="input-group" style={{ display: (dataFilterRadioGroupState === 'byYear') ? 'block' : 'none' }}>
                <Select value={values.year} name='year' label='year' options={yearSelectOptions} onChange={handleChange} />
            </div>
            <div className="input-group" style={{ display: (dataFilterRadioGroupState === 'certain_day') ? 'block' : 'none' }}>

                <DatePicker
                    name='certain_day'
                    label={t("date")}
                    selected={dateState}
                    onChange={(date) => {
                        setDateState(date);
                    }}
                />
            </div>

            <div className="input-group" style={{ display: (dataFilterRadioGroupState === 'period') ? 'block' : 'none' }}>
                <DatePicker
                    name='startDate'
                    label={t("startDate")}
                    selected={startDateState}
                    onChange={(date) => {
                        setStartDateState(date);
                    }}
                />~
                <DatePicker
                    name='endDate'
                    label={t("endDate")}
                    selected={endDateState}
                    onChange={(date) => {
                        setEndDateState(date);
                    }}
                />

            </div>

            <div className="input-group">
                <Button
                    type='submit'
                    displayName={t("submit")}
                    className='ui button btn-primary btn-search'
                    icon='icon search'

                />
            </div>
        </Segment>
        <Radio toggle label='toogle balance detail' onChange={(e) => {

            setDisplayBalanceState((displayBalanceState === 'none') ? 'block' : 'none');
        }} />
        <Segment style={{ display: displayBalanceState }}>
            <span className='amount-label'>Total Income: {assetsDetailState.totalIncomeState}</span>
            <br />
            <span className='amount-label'>Total Expenditure: {assetsDetailState.totalExpenditureState}</span>
            <br />
            <span className='amount-label'>Total Assets: {assetsDetailState.totalAssets} </span>
            <Divider section />
            <span className='amount-label'>Annual Income: {assetsDetailState.annualIncomeState}</span>
            <br />
            <span className='amount-label'>Annual Expenditure:{assetsDetailState.annualExpenditureState}</span>
            <br />
            <span className='amount-label'>Annual Balance: {assetsDetailState.annualBalance}</span>
            <br />
            <span className='amount-label'>average Income/month: {(parseInt(assetsDetailState.annualIncomeState.toString().replace(/,/g, '')) / 12).toFixed(2)}</span>
            <br />
            <span className='amount-label'>average Expenditure/month : {(parseInt(assetsDetailState.annualExpenditureState.toString().replace(/,/g, '')) / 12).toFixed(2)} </span>

            <Divider section />
            <span className='amount-label'>Monthly Income: {assetsDetailState.monthlyIncomeState}</span>
            <br />
            <span className='amount-label'>Monthly Expenditure: {assetsDetailState.monthlyExpenditureState} </span>
            <br />
            <span className='amount-label'>Monthly Balance: {assetsDetailState.monthlyBalance}</span>
            <br />
            <span className='amount-label'>average Income/day: {(parseInt(assetsDetailState.monthlyIncomeState.toString().replace(/,/g, '')) / 30).toFixed(2)}</span>
            <br />
            <span className='amount-label'>average Expenditure/day : {(parseInt(assetsDetailState.monthlyExpenditureState.toString().replace(/,/g, '')) / 30).toFixed(2)} </span>
            <Divider section />

        </Segment>
        <Segment className='accounting-table'>
            <Button
                type='button'
                displayName={t("delete")}
                className='ui button btn-primary '
                icon='icon times circle'
                onClick={(e) => deleteItems(e)}

            />
            <Button
                type='button'
                displayName={t("previous")}
                className='ui button btn-primary '
                icon='left arrow icon'
                onClick={(e) => previousBtnClick(e)}

            />
            <Button
                type='button'
                displayName={t("next")}
                className='ui button btn-primary '
                icon='right arrow icon'
                onClick={(e) => nextBtnClick(e)}

            />
            <PureCheckBox name='checkBox' label='select all' onClick={(e) => selectAllCheckBox(e)} />
            <AccountingTable
                // ref='accountingTable'
                {...props}
                headerSpec={headerSpec}
                queriesData={queriesState.queries}
                selectAll={selectAllState}
                count={queriesState.count}
                time={queriesState.time}
                columnSpec={columnSpec}
                rowSpec={rowSpec}
                displaySummaryBlockFlag={true}
                expenditureSummary={queriesState.expenditureSummary}
                incomeSummary={queriesState.incomeSummary}
            />
        </Segment>

    </Form></>
}

export default Details;

import React, { useState, useEffect, useRef } from 'react';
import { initDB, useIndexedDB } from 'react-indexed-db';
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
import { Segment, Divider } from 'semantic-ui-react';

const radioGroupItem = {
    "items": [{
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
    },],
    "selectedValue": "expenditure"
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
//TODO 拉去db
let categories = config.categories;
let categoryBox = [];

_.each(categories, (v, k) => {
    let items = {
        label: v,
        value: v
    }
    categoryBox.push(items);
});

const selectOptions = {
    "seletedValue": "",
    "disabled": false,
    "items": [...categoryBox]
};

const yearSelectOptions = {
    "seletedValue": moment(new Date()).format('YYYY'),
    "disabled": false,
    "items": [...(utils.initialYearOptions())]
};

const Details = (props) => {
    const { add, getAll, deleteRecord } = useIndexedDB('Accountings');
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
    const [queriesState, setQueriesState] = useState(initialState);

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
    })

    const [dataFilterRadioGroupState, setDataFilterRadioGroupState] = useState(dataFilterRadioBtnInitVal[0]);
    const [radioGroupState, setRadioGroupState] = useState(radioBtnInitVal[0]);
    const initState = {};


    const { values, handleChange, handleSubmit, handleReset } = useForm(resetForm, submit, initState);

    function resetForm() {
    }

    function submit(e, formRef) {

        let category = values.category;
        let type = radioGroupState;
        let date = moment(dateState).format('YYYY/MM/DD');
        let month = moment(dateState).format('MM');
        let day = moment(dateState).format('DD');
        let year = moment(dateState).format('YYYY');

        let startDate = moment(startDateState).format('YYYY/MM/DD');
        let startMonth = moment(startDateState).format('MM');
        let startYear = moment(startDateState).format('YYYY');
        let startDay = moment(startDateState).format('DD');


        let endDate = moment(endDateState).format('YYYY/MM/DD');
        let endMonth = moment(endDateState).format('MM');
        let endYear = moment(endDateState).format('YYYY');
        let endDay = moment(endDateState).format('DD');

        let accountQueriesData = {};

        accountQueriesData.queries = [];



        switch (dataFilterRadioGroupState) {
            case 'month':
                accountQueriesData.queries = [...assetsDetailState.monthlyDatas];
                accountQueriesData.count = accountQueriesData.queries.length;
                accountQueriesData.time = moment().format('YYYY/MM/DD MM:SS');

                setQueriesState(accountQueriesData);

                break;

            case 'year':


                accountQueriesData.queries = [...assetsDetailState.annualDatas];
                accountQueriesData.count = accountQueriesData.queries.length;
                accountQueriesData.time = moment().format('YYYY/MM/DD MM:SS');

                setQueriesState(accountQueriesData);

                break;

            case 'certain_day':

                initialState.queries = initialState.queries.filter((items, index, array) => {

                    return (items.date === date) && ((category) ? (items.category === category) : true) && (items.type == type);
                });

                break;

            case 'period':

                break;

            case 'byYear':

                break;
            default:
                break;
        }




        // values.type = type;
        // values.date = date;
        // values.category = category;
        // values.month = month;
        // values.day = day;
        // values.year = year;


        // values.endDate = startDate;
        // values.endMonth = startMonth;
        // values.endYear = startYear;
        // values.endDay = startDay;



        // values.endDate = endDate;
        // values.endMonth = endMonth;
        // values.endYear = endYear;
        // values.endDay = endDay;


        // let validateResult = true;

        // _.each(values, (v, k) => {

        //     validateResult = validateThis(v, k);

        //     if (!validateResult) {
        //         alert(`${k} format error!`);
        //         return false;
        //     }
        // });


        // if (!validateResult) {
        //     return;
        // }

    }

    const getAllData = () => {
        let datas = _.isEmpty(queriesState) ? props.initialState : queriesState;
        // let accountQueriesData = {};
        // let today = moment().format('YYYY/MM/DD');
        let thisYear = moment().format('YYYY');
        let thisMonth = moment().format('MM');

        let monthlyResult = props.getMonthlyData(datas, thisMonth);

        let annualResult = props.getAnnualData(datas, thisYear);

        let totalAssetsResult = props.getTotalData(datas);

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


        //進來先秀本月的資料 zack 
        queriesState.queries = [...monthlyResult.monthlyDatas];

        setQueriesState(queriesState);
    }

    useEffect(() => {
        getAllData();
    }, []);

    useEffect(() => {



    }, [radioGroupState])

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
    debugger

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
                <Select value={values.category} name='category' label='category' options={selectOptions} onChange={handleChange} />
            </div>

            <div className="input-group" style={{ display: (dataFilterRadioGroupState === 'byYear') ? 'block' : 'none' }}>
                <Select value={yearSelectOptions.seletedValue} name='year' label='year' options={yearSelectOptions} onChange={handleChange} />
            </div>
            <div className="input-group" style={{ display: (dataFilterRadioGroupState === 'certain_day') ? 'block' : 'none' }}>

                <DatePicker
                    label={t("date")}
                    selected={dateState}
                    onChange={(date) => {
                        setDateState(date);
                    }}
                />
            </div>

            <div className="input-group" style={{ display: (dataFilterRadioGroupState === 'period') ? 'block' : 'none' }}>
                <DatePicker
                    label={t("startDate")}
                    selected={startDateState}
                    onChange={(date) => {
                        setStartDateState(date);
                    }}
                />~
                <DatePicker
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
        <Segment>
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
            <Divider section />
            <span className='amount-label'>Monthly Income: {assetsDetailState.monthlyIncomeState}</span>
            <br />
            <span className='amount-label'>Monthly Expenditure: {assetsDetailState.monthlyExpenditureState} </span>
            <br />
            <span className='amount-label'>Monthly Balance: {assetsDetailState.monthlyBalance}</span>
        </Segment>
        <Segment className='accounting-table'>
            <Button
                type='button'
                displayName={t("delete")}
                className='ui button btn-primary '
                icon='icon times circle'
                onClick={(e) => deleteItems(e)}

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
            />
        </Segment>

    </Form></>
}

export default Details;
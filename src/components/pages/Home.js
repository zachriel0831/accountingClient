
import React, { useState, useEffect, useRef } from 'react';
import { initDB, useIndexedDB } from 'react-indexed-db';
import Form from '../Form';
import Text from '../Text';
import Amount from '../Amount';
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
import { Modal } from 'semantic-ui-react';
import EditPanel from '../modals/EditPanel';
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
    ],
    "selectedValue": "month"
}

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

const Home = (props) => {
    const { add, getAll, deleteRecord } = useIndexedDB('Accountings');
    const { t } = useTranslation();
    const _this = this;
    // const initState = props.state;
    const initState = {};
    const [dimmerState, setDimmerState] = useState(false);
    const [selectAllState, setSelectAllState] = useState(false);
    const [checkBoxListState, setCheckBoxListState] = useState([]);
    const [dateState, setDateState] = useState(new Date());
    const [queriesState, setQueriesState] = useState({});
    const [totalExpenditureState, setTotalExpenditureState] = useState(0);
    const [totalIncomeState, setTotalIncomeState] = useState(0);
    const [annualIncomeState, setAnnualIncomeState] = useState(0);
    const [annualExpenditureState, setAnnualExpenditureState] = useState(0);

    const [monthlyIncomeState, setMonthlyIncomeState] = useState(0);
    const [monthlyExpenditureState, setMonthlyExpenditureState] = useState(0);

    const [totalAssets, setTotalAssets] = useState(0);
    const [annualBalance, setAnnualBalance] = useState(0);
    const [monthlyBalance, setMonthlyBalance] = useState(0);



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


    //radioGroup state
    const [radioGroupState, setRadioGroupState] = useState(radioBtnInitVal[0]);

    const [dataFilterRadioGroupState, setDataFilterRadioGroupState] = useState(dataFilterRadioBtnInitVal[0]);


    function resetForm(e, formRef) {
        props.resetKey();
    }

    function submit(e, formRef) {
        let itemId = `${moment().unix()}_${radioGroupState}_${values.category}_${moment(dateState).format('YYYY/MM/DD')}_${values.amount}`;
        let type = radioGroupState;
        let date = moment(dateState).format('YYYY/MM/DD');
        let amount = values.amount;
        let month = moment(dateState).format('MM');
        let day = moment(dateState).format('DD');
        let year = moment(dateState).format('YYYY');;
        let category = values.category;
        let remark = values.remark;

        values.id = itemId;
        values.type = type;
        values.date = date;
        values.amount = amount.replace(/,/g, '');
        values.category = category;
        values.remark = remark ? remark : '';
        values.month = month;
        values.day = day;
        values.year = year;

        let validateResult = true;

        _.each(values, (v, k) => {

            validateResult = validateThis(v, k);

            if (!validateResult) {
                alert(`${k} format error!`);
                return false;
            }
        });


        if (!validateResult) {
            return;
        }

        add(values).then(
            event => {
                console.log('ID Generated: ', event.target);
            },
            error => {
                console.log(error);
            }
        );

        props.resetKey();
    }

    const { values, handleChange, handleSubmit, handleReset } = useForm(resetForm, submit, initState);

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

    const getAllData = () => {
        getAll().then(AccountingData => {
            let accountQueriesData = {};
            let today = moment().format('YYYY/MM/DD');
            let thisYear = moment().format('YYYY');
            let thisMonth = moment().format('MM');

            let totalIncome = 0;
            let totalExpenditure = 0;
            let annualIncome = 0;
            let annualExpenditure = 0;
            let monthlyIncome = 0;
            let monthlyExpenditure = 0;
            accountQueriesData.queries = AccountingData;
            accountQueriesData.time = moment().format('YYYY/MM/DD MM:SS')
            accountQueriesData.count = AccountingData.length;

            let annualDatas = accountQueriesData.queries.filter((items, index, array) => {


                return items.year === thisYear;
            });

            let monthlyDatas = accountQueriesData.queries.filter((items, index, array) => {


                return items.month === thisMonth;
            });

            _.each(annualDatas, (v, k) => {
                if (v.type === 'expenditure') {
                    annualExpenditure += parseInt(v.amount);

                } else if (v.type === 'income') {
                    annualIncome += parseInt(v.amount);
                }
                // console.log(v);
            });

            _.each(monthlyDatas, (v, k) => {
                if (v.type === 'expenditure') {
                    monthlyExpenditure += parseInt(v.amount);

                } else if (v.type === 'income') {
                    monthlyIncome += parseInt(v.amount);
                }
                // console.log(v);
            });


            _.each(accountQueriesData.queries, (v, k) => {
                if (v.type === 'expenditure') {
                    totalExpenditure += parseInt(v.amount);

                } else if (v.type === 'income') {
                    totalIncome += parseInt(v.amount);
                }
                // console.log(v);
            })

            setAnnualExpenditureState(utils.transferToAmountFormat(annualExpenditure));
            setAnnualIncomeState(utils.transferToAmountFormat(annualIncome));

            setMonthlyExpenditureState(utils.transferToAmountFormat(monthlyExpenditure));
            setMonthlyIncomeState(utils.transferToAmountFormat(monthlyIncome));

            setTotalExpenditureState(utils.transferToAmountFormat(totalExpenditure));
            setTotalIncomeState(utils.transferToAmountFormat(totalIncome));

            setTotalAssets(utils.transferToAmountFormat((totalIncome - totalExpenditure)))
            setAnnualBalance(utils.transferToAmountFormat((annualIncome - annualExpenditure)))
            setMonthlyBalance(utils.transferToAmountFormat((monthlyIncome - monthlyExpenditure)))
            let dateFilter = dataFilterRadioGroupState;


            if (dateFilter === 'month') {
                accountQueriesData.queries = [...monthlyDatas];
            } else {
                accountQueriesData.queries = [...annualDatas];

            }


            setQueriesState(accountQueriesData);
        });
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


    useEffect(() => {
        getAllData();
    }, [])

    useEffect(() => {

        getAllData();

    }, [dataFilterRadioGroupState])

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


    return (
        <>
            <Form title='Home' onSubmit={handleSubmit} onReset={handleReset} toggleDimmer={dimmerState}>
                <div className="input-group">
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
                            <DatePicker
                                label={t("date")}
                                selected={dateState}
                                onChange={(date) => {
                                    setDateState(date);
                                }}
                            />

                        </div>
                        <div className="input-group">
                            <Select value={values.category} name='category' label='category' options={selectOptions} onChange={handleChange} />
                        </div>

                        <div className="input-group">
                            <Amount icon='dollar sign' value={values.amount} name='amount' label='amount' onChange={handleChange} />
                        </div>

                        <div className="input-group">
                            <Text icon='sticky note' value={values.remark} name='remark' label='remark' onChange={handleChange} />
                        </div>

                        <Button
                            type='submit'
                            displayName={t("submit")}
                            className='ui button btn-primary btn-search'
                            icon='icon search'

                        />
                        <Button
                            type='button'
                            displayName={t("delete")}
                            className='ui button btn-primary '
                            icon='icon times circle'
                            onClick={(e) => deleteItems(e)}

                        />
                    </Segment>

                    <Segment>
                        <span className='amount-label'>Total Income: {totalIncomeState}</span>
                        <br />
                        <span className='amount-label'>Total Expenditure: {totalExpenditureState}</span>
                        <br />
                        <span className='amount-label'>Total Assets: {totalAssets} </span>
                        <Divider section />
                        <span className='amount-label'>Monthly Income: {monthlyIncomeState}</span>
                        <br />
                        <span className='amount-label'>Monthly Expenditure: {monthlyExpenditureState} </span>
                        <br />
                        <span className='amount-label'>Monthly Balance: {monthlyBalance}</span>
                        <Divider section />
                        <span className='amount-label'>Annual Income: {annualIncomeState}</span>
                        <br />
                        <span className='amount-label'>Annual Expenditure:{annualExpenditureState}</span>
                        <br />
                        <span className='amount-label'>Annual Balance: {annualBalance}</span>
                    </Segment>
                </div>
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
            </Form>
        </>)
}

export default Home;
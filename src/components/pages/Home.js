
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

const Home = (props) => {
    const { add, getAll, deleteRecord } = useIndexedDB('Accountings');
    const { t } = useTranslation();
    // const initState = props.state;
    const initState = {};
    const [dimmerState, setDimmerState] = useState(false);
    const [selectAllState, setSelectAllState] = useState(false);
    const [checkBoxListState, setCheckBoxListState] = useState([]);
    const [dateState, setDateState] = useState(new Date());
    const [queriesState, setQueriesState] = useState(props.initialState);
    const [monthlyBalance, setMonthlyBalance] = useState({
        monthlyIncomeState: 0,
        monthlyExpenditureState: 0,
        monthlyBalance: 0,
        monthlyDatas: [],
    });



    let radioBtnInitVal = [];
    if (radioGroupItem) {
        _.each(radioGroupItem.items, (v, k) => {
            if (v.value === radioGroupItem.selectedValue) {
                radioBtnInitVal.push(v.value);
            }
        })
    }

    //radioGroup state
    const [radioGroupState, setRadioGroupState] = useState(radioBtnInitVal[0]);

    // const [dataFilterRadioGroupState, setDataFilterRadioGroupState] = useState(dataFilterRadioBtnInitVal[0]);


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
            let thisMonth = moment().format('MM');

            accountQueriesData.queries = AccountingData;
            accountQueriesData.time = moment().format('YYYY/MM/DD MM:SS')
            accountQueriesData.count = AccountingData.length;

            let monthlyResult = props.getMonthlyData(accountQueriesData, thisMonth);

            setMonthlyBalance(monthlyResult)

            accountQueriesData.queries = [...monthlyResult.monthlyDatas];

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

                        <span className='amount-label'>Monthly Income: {monthlyBalance.monthlyIncome}</span>
                        <br />
                        <span className='amount-label'>Monthly Expenditure: {monthlyBalance.monthlyExpenditure} </span>
                        <br />
                        <span className='amount-label'>Monthly Balance: {monthlyBalance.monthlyBalance}</span>
                    </Segment>
                </div>

                <Segment className='accounting-table'>
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

            </Form>
        </>)
}

export default Home;
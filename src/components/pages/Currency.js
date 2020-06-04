

import React, { useState, useEffect, useRef } from 'react';
import { initDB, useIndexedDB } from 'react-indexed-db';
import Form from '../Form';
import Text from '../Text';
// import Amount from '../Amount';
import RadioGroup from '../RadioGroup';
import Select from '../Select'
import useForm from '../custom-hooks/useForm';
import _ from 'lodash';
import config from '../../configs/config';
import Button from '../Button';
import { useTranslation } from "react-i18next";
import moment from 'moment';
// import AccountingTable from '../AccountingTable';
import DatePicker from '../DatePicker';
// import PureCheckBox from '../PureCheckBox';
// import { Modal } from 'semantic-ui-react';
// import EditPanel from '../modals/EditPanel';
// import validateThis from '../../validationSet/validations';
import utils from '../../utils/utils';
import { Segment, Divider, Card } from 'semantic-ui-react';
import axios from 'axios';
import PureCheckBox from '../PureCheckBox';
import AccountingTable from '../AccountingTable';
import Amount from '../Amount';
import validateThis from '../../validationSet/validations';

const radioGroupItem = {
    "items": [{
        "label": "foreign exchange",
        "value": "foreign_exchange",
        "groupKey": "_none",
        "disabled": false
    },
    ],
    "selectedValue": "foreign_exchange"
}

const BackUp = (props) => {
    const { t } = useTranslation();
    const initFormState = props.initialState;
    const { add, getAll, deleteRecord } = useIndexedDB('Accountings_Currencies');

    const [dimmerState, setDimmerState] = useState(false);
    const [currencyState, setCurrencyState] = useState('');
    const [optionsState, setOptionState] = useState({});
    const [queriesState, setQueriesState] = useState(props.initialState);
    const [selectAllState, setSelectAllState] = useState(false);
    const [checkBoxListState, setCheckBoxListState] = useState([]);
    const [dateState, setDateState] = useState(new Date());
    const [cardState, setCardState] = useState([]);

    const [calculateTWDState, setCaculateTWDState] = useState(0);
    let radioBtnInitVal = [];
    if (radioGroupItem) {
        _.each(radioGroupItem.items, (v, k) => {
            if (v.value === radioGroupItem.selectedValue) {
                radioBtnInitVal.push(v.value);
            }
        })
    }
    const [radioGroupState, setRadioGroupState] = useState(radioBtnInitVal[0]);

    const { values, handleChange, handleSubmit, handleReset } = useForm(resetForm, submit, {});

    function resetForm() {
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
        let category_new = values.category_new;

        values.id = itemId;
        values.type = type;
        values.date = date;
        values.amount = amount.replace(/,/g, '');
        values.category = category ? category : category_new;
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

    const selectAllCheckBox = (e) => {

        setSelectAllState(!selectAllState);
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
    const doubleClick = (e, trValues) => {
        console.log('click row data: ', trValues);

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


    useEffect(() => {

        axios({
            method: 'get',
            baseURL: config.mode === 0 ? config.crawlingLocalService : config.backEndUrl,
            url: '/currency/get_currency',
            'Content-Type': 'application/json',
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            withCredentials: false,
        }).then(function (response) {
            let responseData = response.data;
            let currencyOptions = [];

            console.log(response);

            setCurrencyState(responseData.data);


            _.each(responseData.data, (v, k) => {
                let cur = v.currency_type.substring(v.currency_type.indexOf('(') + 1, v.currency_type.indexOf(')'));
                let items = {
                    label: cur,
                    value: cur
                }

                currencyOptions.push(items);
            })


            const options = {
                "seletedValue": "",
                "disabled": false,
                "items": [...currencyOptions]
            };

            setOptionState(options);

            // handle success
        }).catch(function (error) {
            // handle error
            console.log(error);
            alert('upload failed!')

        }).finally(function () {
            // always executed
            setDimmerState(false);

        });
    }, []);


    useEffect(() => {

        if (!currencyState) {

            setDimmerState(true);
        } else {

            setDimmerState(false);
        }

    }, [currencyState])


    const headerSpec = {
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
    }

    const columnSpec = [
        {
            header: 'id',
            style: { display: 'none' },
        }
    ];

    const rowSpec = {
        // selectedValue: true,
        selectedValue: false,
        queryUrl: '/',
        method: 'POST',
        requestDataKey: 'id',
        customOnRowDoubleClick: doubleClick,
    }

    // const CardExampleGroupCentered = () => 
    const showSelectCurrencyRate = (e) => {
        let cur = e.currentTarget.value;
        let item = {
            header: '',
            description: '',
            meta: '',
            value: ''
        }
        let itemArray = cardState;
        let duplicateFlag = false;
        _.each(itemArray, (v, k) => {

            if (v.value === cur) {
                duplicateFlag = true;
                return false;
            }
        })
        if (!duplicateFlag) {
            _.each(currencyState, (v, k) => {
                let curToCompare = v.currency_type.substring(v.currency_type.indexOf('(') + 1, v.currency_type.indexOf(')'));
                let curForDisplay = v.currency_type;
                if (cur === curToCompare) {
                    item.header = curForDisplay;
                    item.value = cur;
                    item.description = (<>
                        <>現金匯率</>
                        <br></br>
                        <span className='amount-label'>買入:{v.currency_cash_rate[0]},賣出:{v.currency_cash_rate[1]} </span>
                        <br></br>
                        <>即時匯率</>
                        <br></br>
                        <span className='amount-label'>買入:{v.currency_spot_rate[0]},賣出:{v.currency_spot_rate[1]} </span></>
                    );


                    itemArray.push(item);
                    setCardState(itemArray);

                    return false;
                }

            });
        }

        handleChange(e);
    }

    const calculateRate = (e) => {
        let val = e.currentTarget.value;

        if (val.indexOf(',') !== -1) {
            val.replace(/,/g, '');
        }
        _.each(currencyState, (v, k) => {
            let curToCompare = values.category;
            let cur = v.currency_type.substring(v.currency_type.indexOf('(') + 1, v.currency_type.indexOf(')'));

            if (cur === curToCompare) {


                let rate = v.currency_spot_rate[1];
                let calculatedValue = (val * rate).toFixed(2);
             
                setCaculateTWDState(calculatedValue);
                return false;
            }
        });



        handleChange(e)
    }
    return <>
        <><Form title='Currency' onSubmit={handleSubmit} onReset={handleReset} toggleDimmer={dimmerState}>
            <Segment>
                <label>enter your foreign currency asset</label>

                <div className="input-group">
                    <div className="input-group">
                        <RadioGroup
                            name='type'
                            radioData={radioGroupItem}
                            onClick={(val) => {
                                setRadioGroupState(val)
                            }} />
                    </div>

                    <Select value={values.category} name='category' label='Category' options={optionsState} onChange={(e) => showSelectCurrencyRate(e)} />

                    <div className="input-group ">
                        <DatePicker
                            label={t("Date")}
                            selected={dateState}
                            onChange={(date) => {
                                setDateState(date);
                            }}
                        />

                    </div>
                    <div className="input-group">
                        <Amount decimal maxLength='20' icon='dollar sign' value={values.amount} name='amount' label='amount' onChange={(e) => calculateRate(e)} />
                    </div>
                    <div className="input-group">
                        <span className='amount-label'>TWD: {calculateTWDState}</span>
                    </div>
                    <div className="input-group">
                        <Text icon='sticky note' value={values.remark} name='remark' label='remark' onChange={handleChange} />
                    </div>
                    <Button
                        type='submit'
                        displayName={t("Send")}
                        className='ui button btn-primary btn-search'
                        icon='icon search'

                    />
                </div>

            </Segment>
            <Segment>
                <Card.Group centered items={cardState} />
            </Segment>

            <Segment className='accounting-table'>
                <Button
                    type='button'
                    displayName={t("Delete")}
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
    </>
}

export default BackUp;

import React, { useState, useEffect } from 'react';
import { useIndexedDB } from 'react-indexed-db';
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
// import { Modal } from 'semantic-ui-react';
// import EditPanel from '../modals/EditPanel';
import validateThis from '../../validationSet/validations';
// import utils from '../../utils/utils';
import { Segment } from 'semantic-ui-react';



const Home = (props) => {
    const { add, getAll, deleteRecord } = useIndexedDB('Accountings');
    const categoryDB = useIndexedDB('Accountings_Categories');
    const { t } = useTranslation();
    const [dimmerState, setDimmerState] = useState(false);
    const [selectAllState, setSelectAllState] = useState(false);
    const [checkBoxListState, setCheckBoxListState] = useState([]);
    const [dateState, setDateState] = useState(new Date());
    const [queriesState, setQueriesState] = useState({});
    const [optionsState, setOptionState] = useState({});
    const [pureCheckBoxState, setPureCheckBoxState] = useState([]);

    const radioGroupItem = {
        "items": [{
            "label": t("expenditure"),
            "value": "expenditure",
            "groupKey": "_none",
            "disabled": false
        },
        {
            "label": t("income"),
            "value": "income",
            "groupKey": "_none",
            "disabled": false
        },],
        "selectedValue": "expenditure"
    }

    const regular_item = {
        "items": [
            {
                "label": t("none"),
                "value": "",
                "groupKey": "_none",
                "disabled": false
            },
            {
                "label": t("foods"),
                "value": "foods",
                "groupKey": "_none",
                "disabled": false
            },
            {
                "label": t("entertaining"),
                "value": "entertaining",
                "groupKey": "_none",
                "disabled": false
            },
            {
                "label": t("travel"),
                "value": "travel",
                "groupKey": "_none",
                "disabled": false
            }
        ],
        "selectedValue": ""
    }

    const [monthlyBalance, setMonthlyBalance] = useState({
        monthlyIncomeState: 0,
        monthlyExpenditureState: 0,
        monthlyBalance: 0,
        monthlyDatas: [],
    });

    // const [optionsState, setOptionState] = useState(props.getHomeOptions(categoryDB));

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
    const [regularItemState, setRegularItemState] = useState(regular_item[0]);
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
        let year = moment(dateState).format('YYYY');
        let category = values.category;
        let remark = values.remark;
        let category_new = values.category_new;
        let regularItem = regularItemState ? regularItemState : '';

        values.id = itemId;
        values.type = type;
        values.date = date;
        values.amount = amount ? amount.replace(/,/g, '') : '';

        if (regularItem !== '') {
            values.category = regularItem;
        } else {
            values.category = category ? category : category_new;
        }

        values.remark = remark ? remark : '';
        values.month = month;
        values.day = day;
        values.year = year;

        let validateResult = true;

        if (category_new) {
            let add_category = {
                id: moment().unix(),
                name: category_new
            }
            categoryDB.add(add_category).then(
                event => {
                    console.log('ID Generated: ', event.target);
                },
                error => {
                    console.log(error);
                }
            );
        }

        _.each(values, (v, k) => {
            validateResult = validateThis(v, k);

            if (!validateResult) {
                alert(`${k} ${t('format_error')}!`);
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

    const { values, handleChange, handleSubmit, handleReset } = useForm(resetForm, submit, {});

    const selectAllCheckBox = (e) => {
        setSelectAllState(!selectAllState);
    }

    const deleteItems = (e) => {
        _.each(checkBoxListState, (v, k) => {
            let id = v;
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

            let monthlyResult = props.getMonthlyData(accountQueriesData, thisMonth);

            setMonthlyBalance(monthlyResult)

            accountQueriesData.queries = [...monthlyResult.monthlyDatas];
            accountQueriesData.count = accountQueriesData.queries.length;

            setQueriesState(accountQueriesData);
        });
    }

    const selectedCheckBoxClick = (e, val, checked, checkedTarget) => {

        // if (checked) {
        //     checkBoxListState.push(val);
        //     setCheckBoxListState(checkBoxListState);
        // } else {
        //     let newArray = checkBoxListState.filter(function (item, index, array) {
        //         console.log(item[0]);

        //         return checkedTarget[0] !== item[0];
        //     });
        //     setCheckBoxListState(newArray);
        // }

        setPureCheckBoxState({ 'val': val, 'checked': checked, 'checkedTarget': checkedTarget });

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
            { id: 'id', headerName: t('id'), style: { display: 'none' } },
            { id: 'type', headerName: t('type') },
            { id: 'category', headerName: t('category') },
            { id: 'amount', headerName: t('amount') },
            { id: 'date', headerName: t('date') },
            { id: 'remark', headerName: t('remark') },

        ],
        selectable: true, //開啟checkbox
        selectableDisplayName: { id: 'select', headerName: t('check') },
        onCheckBoxClick: selectedCheckBoxClick,
        getAllCheckBoxVal: (val) => getAllCheckBoxVal(val),
        amountSortingHeaderKey: ["amount"],
    }

    useEffect(() => {
        getAllData();

        let categories = config.categories;
        let categoryBox = [];

        _.each(categories, (v, k) => {
            let items = {
                label: t(v),
                value: v
            }
            categoryBox.push(items);
        });

        categoryDB.getAll().then(categories => {
            _.each(categories, (v, k) => {
                let items = {
                    label: t(v.name),
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

    useEffect(() => {
        if (pureCheckBoxState) {
            let checked = pureCheckBoxState.checked;
            let val = pureCheckBoxState.val;
            let checkedTarget = pureCheckBoxState.checkedTarget;

            let newArray;
            if (checked) {

                newArray = [...checkBoxListState, val[0]];
            } else {
                newArray = checkBoxListState.filter(function (item, index, array) {
                    console.log(item[0]);

                    return checkedTarget[0] !== item;
                });
            }
            setCheckBoxListState(newArray);
        }

    }, [pureCheckBoxState]);


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
            <Form title={t('Home')} onSubmit={handleSubmit} onReset={handleReset} toggleDimmer={dimmerState}>
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
                            <RadioGroup
                                name='regular_item'
                                radioData={regular_item}
                                onClick={(val) => {
                                    setRegularItemState(val)
                                }} />
                        </div>

                        <div className="input-group">
                            <Select disabled={regularItemState ? true : false} value={values.category} name='category' label={t('category')} options={optionsState} onChange={handleChange} />
                            {regularItemState ?
                                <></> :
                                <Text
                                    icon='pencil alternate'
                                    value={values.category_new}
                                    name='category_new'
                                    label={t('new_option')}
                                    onChange={handleChange}
                                    disabled={values.category ? true : false} />}

                        </div>

                        <div className="input-group">
                            <Amount icon='dollar sign' value={values.amount} name='amount' label={t('amount')} onChange={handleChange} />
                        </div>

                        <div className="input-group">
                            <Text icon='sticky note' value={values.remark} name='remark' label={t('remark')} onChange={handleChange} />
                        </div>

                        <Button
                            type='submit'
                            displayName={t("send")}
                            className='ui button btn-primary btn-search'
                            icon='icon search'

                        />
                    </Segment>

                    <Segment>

                        <span className='amount-label'>{t('monthly_Income')}: {monthlyBalance.monthlyIncome}</span>
                        <br />
                        <span className='amount-label'>{t('monthly_Expenditure')}: {monthlyBalance.monthlyExpenditure} </span>
                        <br />
                        <span className='amount-label'>{t('monthly_Balance')}: {monthlyBalance.monthlyBalance}</span>
                    </Segment>
                </div>

                <Segment className='accounting-table'>
                    <Button
                        type='button'
                        displayName={t("Delete")}
                        className='ui button btn-primary '
                        icon='icon times circle'
                        onClick={(e) => deleteItems(e)}

                    />

                    <PureCheckBox name='checkBox' label={t('select_all')} onClick={(e) => selectAllCheckBox(e)} />
                    <AccountingTable
                        {...props}
                        categoryOptions={optionsState}
                        headerSpec={headerSpec}
                        queriesData={queriesState.queries}
                        selectAll={selectAllState}
                        count={queriesState.count}
                        columnSpec={columnSpec}
                        rowSpec={rowSpec}
                    />
                </Segment>
            </Form>
        </>)
}

export default Home;
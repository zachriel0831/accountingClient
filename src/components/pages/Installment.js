import React, { useState, useEffect, useRef } from 'react';
import { initDB, useIndexedDB } from 'react-indexed-db';
import Form from '../Form';
import Text from '../Text';
import Amount from '../Amount';
import Select from '../Select'
import useForm from '../custom-hooks/useForm';
import _ from 'lodash';
import config from '../../configs/config';
import Button from '../Button';
import { useTranslation } from "react-i18next";
import moment from 'moment';
import DatePicker from '../DatePicker';
import validateThis from '../../validationSet/validations';
import utils from '../../utils/utils';
import { Segment, Divider } from 'semantic-ui-react';

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

const Installment = (props) => {
    const { add, getAll, deleteRecord } = useIndexedDB('Accountings');
    const { t } = useTranslation();
    const _this = this;
    const initState = {};
    const [dimmerState, setDimmerState] = useState(false);
    const [dateState, setDateState] = useState(new Date());
    const [totalExpenditureState, setTotalExpenditureState] = useState(0);
    const [totalIncomeState, setTotalIncomeState] = useState(0);
    const [totalAssets, setTotalAssets] = useState(0);
    const [queryDisable, setQueryDisabl] = useState(false);

    function calculate(e, formRef) {
        console.log("calculate");
        let itemId = `${moment().unix()}_expenditure_${values.category}_${moment(dateState).format('YYYY/MM/DD')}_${values.amount}`;
        let type = "expenditure";
        let date = moment(dateState).format('YYYY/MM/DD');
        let amount = values.amount;
        let month = moment(dateState).format('MM');
        let day = moment(dateState).format('DD');
        let year = moment(dateState).format('YYYY');;
        let category = values.category;
        let remark = values.remark;
        let times = values.times;

        values.id = itemId;
        values.type = type;
        values.date = date;
        values.amount = amount ? amount.replace(/,/g, '') : '';
        values.category = category;
        values.remark = remark ? remark : '';
        values.month = month;
        values.day = day;
        values.year = year;
        values.times = times ? times : "1";

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

        let installmentExp = 0;
        installmentExp = amount * times;
        let testExp = parseInt(totalExpenditureState.replace(/,/g, '')) + parseInt(installmentExp);
        let testAsset = parseInt(totalIncomeState.replace(/,/g, '')) - testExp;
        setTotalExpenditureState(utils.transferToAmountFormat(testExp));
        setTotalAssets(utils.transferToAmountFormat(testAsset));
        setQueryDisabl(true);
    }

    function resetForm(e, formRef) {
        props.resetKey();
    }

    async function submit(e, formRef) {
        console.log("submit");
        let itemId = `${moment().unix()}_expenditure_${values.category}_${moment(dateState).format('YYYY/MM/DD')}_${values.amount}`;
        let type = "expenditure";
        let date = moment(dateState).format('YYYY/MM/DD');
        let amount = values.amount;
        let month = moment(dateState).format('MM');
        let day = moment(dateState).format('DD');
        let year = moment(dateState).format('YYYY');;
        let category = values.category;
        let remark = values.remark;
        let times = values.times;

        values.id = itemId;
        values.type = type;
        values.date = date;
        values.amount = amount ? amount.replace(/,/g, '') :'';
        values.category = category;
        values.remark = remark ? remark : '';
        values.month = month;
        values.day = day;
        values.year = year;
        values.times = times ? times : "1";

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

        for (let i = 0; i < times; i++) {
            let applyDate = new Date(date);
            let installmentDate = moment(applyDate).add(i, 'months').format('YYYY/MM/DD');
            values.date = installmentDate;
            values.month = moment(installmentDate).format('MM');
            values.id = `${moment().unix()}_expenditure_${values.category}_${moment(installmentDate).format('YYYY/MM/DD')}_${values.amount}`;
            await add(values).then(
                event => {
                    console.log('ID Generated: ', event.target);
                },
                error => {
                    console.log(error);
                }
            );
        }
        props.resetKey();
    }

    const { values, handleChange, handleSubmit, handleReset } = useForm(resetForm, submit, initState);

    useEffect(() => {
        getAllData();
    }, [])

    const getAllData = () => {
        getAll().then(AccountingData => {
            let accountQueriesData = {};

            let totalIncome = 0;
            let totalExpenditure = 0;
            accountQueriesData.queries = AccountingData;
            accountQueriesData.time = moment().format('YYYY/MM/DD MM:SS')
            accountQueriesData.count = AccountingData.length;

            _.each(accountQueriesData.queries, (v, k) => {
                if (v.type === 'expenditure') {
                    totalExpenditure += parseInt(v.amount);

                } else if (v.type === 'income') {
                    totalIncome += parseInt(v.amount);
                }
            })

            setTotalExpenditureState(utils.transferToAmountFormat(totalExpenditure));
            setTotalIncomeState(utils.transferToAmountFormat(totalIncome));
            setTotalAssets(utils.transferToAmountFormat((totalIncome - totalExpenditure)))
        });
    }

    return (
        <>
            <Form title='Installment' onSubmit={handleSubmit} onReset={handleReset} toggleDimmer={dimmerState}>
                <div className="input-group">
                    <Segment>
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
                            <Text icon='sticky note' value={values.times} name='times' label='times' onChange={handleChange} />
                        </div>
                        <div className="input-group">
                            <Amount icon='dollar sign' value={values.amount} name='amount' label='amount' onChange={handleChange} />
                        </div>

                        <div className="input-group">
                            <Text icon='sticky note' value={values.remark} name='remark' label='remark' onChange={handleChange} />
                        </div>

                        <Button
                            type='button'
                            displayName={t("calculate")}
                            className='ui button btn-primary btn-search'
                            icon='icon search'
                            onClick={(e) => calculate(e)}
                            disabled={queryDisable}
                        />

                        <Button
                            type='submit'
                            displayName={t("submit")}
                            className='ui button btn-primary btn-search'
                            icon='icon search'
                        />

                        <Button
                            type='button'
                            displayName={t("reset")}
                            className='ui button btn-primary '
                            icon='icon times circle'
                            onClick={(e) => resetForm(e)}
                        />
                    </Segment>

                    <Segment>
                        <span className='amount-label'>Total Income: {totalIncomeState}</span>
                        <br />
                        <span className='amount-label'>Total Expenditure: {totalExpenditureState}</span>
                        <br />
                        <span className='amount-label'>Total Assets: {totalAssets} </span>
                    </Segment>
                </div>
            </Form>
        </>
    )
}

export default Installment;

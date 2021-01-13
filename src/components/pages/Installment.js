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
import DatePicker from '../DatePicker';
import validateThis from '../../validationSet/validations';
import utils from '../../utils/utils';
import { Segment } from 'semantic-ui-react';

const Installment = (props) => {
    const { t } = useTranslation();

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

    let categories = config.categories;
    let categoryBox = [];

    _.each(categories, (v, k) => {
        let items = {
            label: t(v),
            value: v
        }
        categoryBox.push(items);
    });

    const selectOptions = {
        "seletedValue": "",
        "disabled": false,
        "items": [...categoryBox]
    };


    const { add, getAll } = useIndexedDB('Accountings');

    const initState = {};
    const [dimmerState, setDimmerState] = useState(false);
    const [dateState, setDateState] = useState(new Date());
    const [totalExpenditureState, setTotalExpenditureState] = useState(0);
    const [estimateAmountState, setEstimateAmountState] = useState(0);
    const [totalIncomeState, setTotalIncomeState] = useState(0);
    const [totalAssets, setTotalAssets] = useState(0);
    const [queryDisable, setQueryDisabl] = useState(false);

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

    function calculate(e, formRef) {
        console.log("calculate");
        let itemId = `${moment().unix()}_${radioGroupState}_${values.category}_${moment(dateState).format('YYYY/MM/DD')}_${values.amount}`;
        let type = radioGroupState;
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
        values.amount = amount;
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

        let calExp = 0;
        let calIncome = 0;
        let calAsset = 0;
        let assetTest = 0;
        assetTest = totalAssets.replace(/,/g, '');
        amount = values.amount.replace(/,/g, '');
        let calAmount = amount * times;
        console.log("amount * times:" + amount + "*" + times + "=" + calAmount);
        setEstimateAmountState(utils.transferToAmountFormat(parseInt(calAmount)));
        if (radioGroupState === "expenditure") {
            calExp = parseInt(calAmount);
            setTotalExpenditureState(utils.transferToAmountFormat(parseInt(totalExpenditureState.replace(/,/g, '')) + parseInt(calAmount)));
        } else if (radioGroupState === "income") {
            calIncome = parseInt(calAmount);
            setTotalIncomeState(utils.transferToAmountFormat(parseInt(totalIncomeState.replace(/,/g, '')) + parseInt(calAmount)));
        }


        calAsset = parseInt(assetTest) + calIncome - calExp;
        setTotalAssets(utils.transferToAmountFormat(calAsset));
        setQueryDisabl(true);
    }

    function resetForm(e, formRef) {
        props.resetKey();
    }

    async function submit(e, formRef) {
        console.log("submit");
        let itemId = `${moment().unix()}_${radioGroupState}_${values.category}_${moment(dateState).format('YYYY/MM/DD')}_${values.amount}`;
        let type = radioGroupState;
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
        values.amount = amount;
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
            values.amount = amount.replace(/,/g, '');
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
            <Form title={t("installment")} onSubmit={handleSubmit} onReset={handleReset} toggleDimmer={dimmerState}>
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
                        <div className="input-group">
                            <Text icon='sticky note' value={values.times} name='times' label={t('times')} onChange={handleChange} />
                        </div>
                        <div className="input-group">
                            <Amount icon='dollar sign' value={values.amount} name='amount' label={t('amount')} onChange={handleChange} />
                        </div>

                        <div className="input-group">
                            <Text icon='sticky note' value={values.remark} name='remark' label={t('remark')} onChange={handleChange} />
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

                        <span className='amount-label'>{t('amount')}: {estimateAmountState}</span>
                        <br />
                        <span className='amount-label'>{t('total_income')}: {totalIncomeState}</span>
                        <br />
                        <span className='amount-label'>{t('total_expenditure')}: {totalExpenditureState}</span>
                        <br />
                        <span className='amount-label'>{t('total_assets')}: {totalAssets} </span>
                    </Segment>
                </div>
            </Form>
        </>
    )
}

export default Installment;

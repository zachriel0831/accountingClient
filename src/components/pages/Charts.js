

import React, { useState, useEffect, useRef } from 'react';
import { initDB, useIndexedDB } from 'react-indexed-db';
import Form from '../Form';
// import Text from '../Text';
// import Amount from '../Amount';
import RadioGroup from '../RadioGroup';
// import Select from '../Select'
import useForm from '../custom-hooks/useForm';
import _ from 'lodash';
import config from '../../configs/config';
// import Button from '../Button';
import { useTranslation } from "react-i18next";
import moment from 'moment';
// import AccountingTable from '../AccountingTable';
// import DatePicker from '../DatePicker';
// import PureCheckBox from '../PureCheckBox';
// import { Modal } from 'semantic-ui-react';
// import EditPanel from '../modals/EditPanel';
// import validateThis from '../../validationSet/validations';
import utils from '../../utils/utils';
import { Segment, Divider } from 'semantic-ui-react';
import Chart from 'chart.js';

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

const Charts = (props) => {
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

    function submit() {
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
    }

    useEffect(() => {
        getAllData();
    }, []);

    useEffect(() => {
        let queryDatas = queriesState.queries;

        if (queryDatas) {
            let type = radioGroupState;

            queryDatas = queryDatas.filter((items, index, array) => {
                return items.type === type;
            });

        let labels = [];
        let categoryBox = [];
        let data = [];
        let bgColors = [];
        let bdColors = [];
        _.each(queryDatas, (v, k) => {
            let itemCategory = v.category;
            let itemAmount = parseInt(v.amount);
            // labels = [...labels, itemCategory];

            if (labels.length !== 0) {
                if (labels.includes(itemCategory)) {
                    _.each(categoryBox, (v, k) => {
                        if (v.category === itemCategory) {
                            v.category = itemCategory;
                            let amount = parseInt(v.amount);
                            v.amount = (amount += parseInt(itemAmount));
                            // categoryBox.push({ category: itemCategory, amount: itemAmount })
                        }
                    });

                } else {
                    labels = [...labels, itemCategory];
                    categoryBox.push({ category: itemCategory, amount: itemAmount })

                }

            } else {
                labels.push(itemCategory);
                categoryBox.push({ category: itemCategory, amount: itemAmount });
            }
        });

        _.each(categoryBox, (v, k) => {
            // labels.push(v.category);
            data.push(v.amount);
        })

        _.each(labels, (v, k) => {
            let generageColor = utils.random_rgba(0.2, 1);
            bgColors.push(generageColor[0]);
            bdColors.push(generageColor[1]);
        })
        var ctx = document.getElementById('myChart');

        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'amount',
                    data: data,
                    backgroundColor: bgColors,
                    borderColor: bdColors,
                    borderWidth: 1
                }],
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                events: ['mousemove', 'click', 'touchstart', 'touchmove'],
                hover: {
                    mode: 'index',
                    intersect: false
                },
                legend: {
                    display: false,
                }
            }
        });
        }
    }, [])




    return <>
        <><Form title='Details' onSubmit={handleSubmit} onReset={handleReset} toggleDimmer={dimmerState}>
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

            </Segment>

            <Segment>
            <canvas id="myChart"></canvas>
        </Segment>

        </Form></>
    </>
}

export default Charts;
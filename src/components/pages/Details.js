
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

const Details = (props) => {

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

    const { getAll } = useIndexedDB('Accountings');
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
    const [dataFilterRadioGroupState, setDataFilterRadioGroupState] = useState(dataFilterRadioBtnInitVal[0]);
    const [radioGroupState, setRadioGroupState] = useState(radioBtnInitVal[0]);



    const { values, handleChange, handleSubmit, handleReset } = useForm(resetForm, submit, initState);

    function resetForm() {


    }

    function submit() {
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

    useEffect(() => {
        getAllData();

    }, []);

    useEffect(() => {

        let queryDatas = queriesState.queries;
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
    }, [queriesState])

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

        </Segment>
        <Segment>
            <span className='amount-label'>Total Income: {totalIncomeState}</span>
            <br />
            <span className='amount-label'>Total Expenditure: {totalExpenditureState}</span>
            <br />
            <span className='amount-label'>Total Assets: {totalAssets} </span>
            <Divider section />
            <span className='amount-label'>Annual Income: {annualIncomeState}</span>
            <br />
            <span className='amount-label'>Annual Expenditure:{annualExpenditureState}</span>
            <br />
            <span className='amount-label'>Annual Balance: {annualBalance}</span>
            <Divider section />
            <span className='amount-label'>Monthly Income: {monthlyIncomeState}</span>
            <br />
            <span className='amount-label'>Monthly Expenditure: {monthlyExpenditureState} </span>
            <br />
            <span className='amount-label'>Monthly Balance: {monthlyBalance}</span>

        </Segment>
        <Segment>
            <canvas id="myChart"></canvas>
        </Segment>

    </Form></>
}

export default Details;


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
// import AccountingTable from '../AccountingTable';
import DatePicker from '../DatePicker';
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

const yearSelectOptions = {
    "seletedValue": moment(new Date()).format('YYYY'),
    "disabled": false,
    "items": [...(utils.initialYearOptions())]
};

const Charts = (props) => {
    const { t } = useTranslation();
    const categoryDB = useIndexedDB('Accountings_Categories');

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
    const [chartState, setChartState] = useState({});
    const [dimmerState, setDimmerState] = useState(false);
    // const [selectAllState, setSelectAllState] = useState(false);
    // const [checkBoxListState, setCheckBoxListState] = useState([]);
    const [dateState, setDateState] = useState(new Date());
    const [endDateState, setEndDateState] = useState(new Date());
    const [optionsState, setOptionState] = useState({});

    const [startDateState, setStartDateState] = useState(new Date());
    const [queriesState, setQueriesState] = useState({});
    const [itemLineChartState, setItemLineChartState] = useState([]);
    // const [displayBalanceState, setDisplayBalanceState] = useState('none');

    // const [countYearState, setCountYearState] = useState(moment(new Date()).format('YYYY').toString());
    // const [countMonthState, setCountMonthState] = useState(moment(new Date()).format('MM').toString());

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

                break;

            case 'year':


                accountQueriesData.queries = [...assetsDetailState.annualDatas];

                accountQueriesData.queries = accountQueriesData.queries.filter((items, index, array) => {

                    return ((category) ? (items.category === category) : true) && (!(type === 'all') ? (items.type === type) : true);
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

                setQueriesState(accountQueriesData);

                break;

            case 'certain_day':
                accountQueriesData.queries = initialState.queries.filter((items, index, array) => {

                    return (items.date === date) && ((category) ? (items.category === category) : true) && (!(type === 'all') ? (items.type === type) : true);
                });

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

                break;

            case 'period':
                accountQueriesData.queries = initialState.queries.filter((items, index, array) => {

                    return moment(items.date).isAfter(startDate) && moment(items.date).isBefore(endDate) && ((category) ? (items.category === category) : true) && (!(type === 'all') ? (items.type == type) : true);
                });

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

                break;

            case 'byYear':
                accountQueriesData.queries = initialState.queries.filter((items, index, array) => {

                    return items.year === values.year && ((category) ? (items.category === category) : true) && (!(type === 'all') ? (items.type === type) : true);
                });

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
                break;
            default:
                break;
        }
    }

    const addItemToChart = (e) => {
        let item = values.category;

        generateLineChart('itemComparisonPerMonth', item);

    }

    const resetItemLineChart = (e) => {

        setItemLineChartState([]);
        chartState.destroy();
        var item_ctx_line = document.getElementById("itemLineChart");

        var item_line_Chart = new Chart(item_ctx_line, {
            type: 'line',
            data: {
                labels: ["Jan.", "Feb.", "March.", "April", "May", "June", "July", "august", "Sept", "Oct", 'Nov', 'Dec'],
                datasets: []
            },
            options: {
                responsive: true, // Instruct chart js to respond nicely.
                maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height 
            }
        });

        setChartState(item_line_Chart);

    }

    const generateLineChart = (displayType, item, cmd) => {


        let datas = { ...props.initialState };
        let thisYear = moment().format('YYYY');
        let itemsOfThisYear = datas.queries.filter((items, index, array) => {

            let dates = items.date.split('/')[0];

            return dates === thisYear;
        });
        let chartDataSetBox = [];

        switch (displayType) {
            case 'balanceComparisonPerMonth':
                var ctx_line = document.getElementById("lineChart");



                let monthlyExpenditureSummaryArray = [];
                let monthlyIncomeSummaryArray = [];

                for (var i = 1; i <= 12; i++) {

                    let monthFormat = (i < 10) ? ('0' + i) : (i + '');
                    let monthlyExpenditureSummary = 0;
                    let monthlyIncomeSummary = 0;

                    let expenditureData_of_each_month = itemsOfThisYear.filter((items, index, array) => {
                        return items.type === 'expenditure' && items.month === monthFormat;
                    });

                    let income_of_each_month = itemsOfThisYear.filter((items, index, array) => {
                        return items.type === 'income' && items.month === monthFormat;
                    });

                    _.each(income_of_each_month, (v, k) => {
                        monthlyIncomeSummary += parseInt(v.amount);
                    });

                    _.each(expenditureData_of_each_month, (v, k) => {
                        monthlyExpenditureSummary += parseInt(v.amount);
                    });

                    monthlyExpenditureSummaryArray.push(monthlyExpenditureSummary);
                    monthlyIncomeSummaryArray.push(monthlyIncomeSummary);
                }


                chartDataSetBox.push({
                    label: 'Annual expenditure', // Name the series
                    data: monthlyExpenditureSummaryArray, // Specify the data values array
                    fill: false,
                    borderColor: '#FF0000', // Add custom color border (Line)
                    backgroundColor: '#FF0000', // Add custom color background (Points and Fill)
                    borderWidth: 1 // Specify bar border width
                });

                chartDataSetBox.push({
                    label: 'Annual income', // Name the series
                    data: monthlyIncomeSummaryArray, // Specify the data values array
                    fill: false,
                    borderColor: '#DCB5FF', // Add custom color border (Line)
                    backgroundColor: '#DCB5FF', // Add custom color background (Points and Fill)
                    borderWidth: 1 // Specify bar border width
                });

                //line chart
                var line_Chart = new Chart(ctx_line, {
                    type: 'line',
                    data: {
                        labels: ["Jan.", "Feb.", "March.", "April", "May", "June", "July", "august", "Sept", "Oct", 'Nov', 'Dec'],
                        datasets: [...chartDataSetBox]
                    },
                    options: {
                        responsive: true, // Instruct chart js to respond nicely.
                        maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height 
                    }
                });


                break;

            case 'itemComparisonPerMonth':
                var item_ctx_line = document.getElementById("itemLineChart");
                let itemExpenditureSummaryArray = [];

                for (var i = 1; i <= 12; i++) {

                    let monthFormat = (i < 10) ? ('0' + i) : (i + '');
                    let monthlyExpenditureSummary = 0;

                    let data_of_each_month = itemsOfThisYear.filter((items, index, array) => {
                        return items.month === monthFormat && items.category === item;
                    });


                    _.each(data_of_each_month, (v, k) => {
                        monthlyExpenditureSummary += parseInt(v.amount);
                    });

                    itemExpenditureSummaryArray.push(monthlyExpenditureSummary);
                }

                if (item_ctx_line.$chartjs) {
                    let lineColor = utils.getRandomColor();
                    chartDataSetBox = [...itemLineChartState, {
                        label: item, // Name the series
                        data: itemExpenditureSummaryArray, // Specify the data values array
                        fill: false,
                        borderColor: lineColor, // Add custom color border (Line)
                        backgroundColor: lineColor, // Add custom color background (Points and Fill)
                        borderWidth: 1 // Specify bar border width
                    }]
                    setItemLineChartState([...chartDataSetBox]);

                    chartState.destroy();

                    let newChartState = new Chart(item_ctx_line, {
                        type: 'line',
                        data: {
                            labels: ["Jan.", "Feb.", "March.", "April", "May", "June", "July", "august", "Sept", "Oct", 'Nov', 'Dec'],
                            datasets: [...chartDataSetBox]
                        },
                        options: {
                            responsive: true, // Instruct chart js to respond nicely.
                            maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height 
                        }
                    });

                    setChartState(newChartState);

                }

                break;
            default:
                break;
        }
    }

    useEffect(() => {
        generateLineChart('balanceComparisonPerMonth');

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
        var item_ctx_line = document.getElementById("itemLineChart");

        var item_line_Chart = new Chart(item_ctx_line, {
            type: 'line',
            data: {
                labels: ["Jan.", "Feb.", "March.", "April", "May", "June", "July", "august", "Sept", "Oct", 'Nov', 'Dec'],
                datasets: []
            },
            options: {
                responsive: true, // Instruct chart js to respond nicely.
                maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height 
            }
        });

        setChartState(item_line_Chart);


        let datas = { ...props.initialState };
        let thisMonth = moment().format('MM');
        let monthlyResult = props.getMonthlyData(datas, thisMonth);

        // let annualResult = props.getAnnualData(datas, thisYear);

        // let totalAssetsResult = props.getTotalData(datas);

        // setAssetsDetailsState(
        //     {
        //         monthlyIncomeState: monthlyResult.monthlyIncome,
        //         monthlyExpenditureState: monthlyResult.monthlyExpenditure,
        //         monthlyBalance: monthlyResult.monthlyBalance,
        //         monthlyDatas: monthlyResult.monthlyDatas,
        //         annualIncomeState: annualResult.annualIncome,
        //         annualExpenditureState: annualResult.annualExpenditure,
        //         annualBalance: annualResult.annualBalance,
        //         annualDatas: annualResult.annualDatas,
        //         totalIncomeState: totalAssetsResult.totalIncome,
        //         totalExpenditureState: totalAssetsResult.totalExpenditure,
        //         totalAssets: totalAssetsResult.totalAssets,
        //     }
        // )

        //進來先秀本月的資料 zack 
        let pieData = {};
        pieData.queries = monthlyResult.monthlyDatas.filter((items, index, array) => {

            return items.type === 'expenditure';
        });
        pieData.count = pieData.queries.length;
        pieData.time = moment().format('YYYY/MM/DD MM:SS');
        pieData.incomeSummary = monthlyResult.monthlyIncome;
        pieData.expenditureSummary = monthlyResult.monthlyExpenditure;

        var ctx = document.getElementById('myChart');

        // pie chart
        let labels = [];
        let categoryBoxForPie = [];
        let label_data = [];
        let bgColors = [];
        let bdColors = [];

        _.each(pieData.queries, (v, k) => {
            let itemCategory = v.category;
            let itemAmount = parseInt(v.amount);
            // labels = [...labels, itemCategory];

            if (labels.length !== 0) {
                if (labels.includes(itemCategory)) {
                    _.each(categoryBoxForPie, (v, k) => {
                        if (v.category === itemCategory) {
                            v.category = itemCategory;
                            let amount = parseInt(v.amount);
                            v.amount = (amount += parseInt(itemAmount));
                            // categoryBox.push({ category: itemCategory, amount: itemAmount })
                        }
                    });

                } else {
                    labels = [...labels, itemCategory];
                    categoryBoxForPie.push({ category: itemCategory, amount: itemAmount })

                }

            } else {
                labels.push(itemCategory);
                categoryBoxForPie.push({ category: itemCategory, amount: itemAmount });
            }
        });

        _.each(categoryBoxForPie, (v, k) => {
            // labels.push(v.category);
            label_data.push(v.amount);
        })

        _.each(labels, (v, k) => {
            let generageColor = utils.random_rgba(0.2, 1);
            bgColors.push(generageColor[0]);
            bdColors.push(generageColor[1]);
        })

        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'amount',
                    data: label_data,
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

    }, [])

    return <>
        <><Form title='Charts' onSubmit={handleSubmit} onReset={handleReset} toggleDimmer={dimmerState}>
            {/* <Segment> */}
            {/* <div className="input-group">
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
                </div>*/}
            {/* </Segment> */}


            <Segment>

                <canvas id="lineChart"></canvas>

            </Segment>


            <Segment>
                <div className="input-group">
                    <Select value={values.category} name='category' label='category' options={optionsState} onChange={handleChange} />
                </div>
                <div className="input-group">
                    <Button
                        type='button'
                        displayName={t("add")}
                        className='ui button btn-primary btn-search'
                        icon='icon add'
                        onClick={(e) => addItemToChart(e)}

                    />
                    <Button
                        type='button'
                        displayName={t("reset")}
                        className='ui button btn-primary btn-search'
                        icon='icon minus square outline'
                        onClick={(e) => resetItemLineChart(e)}

                    />

                </div>
                <div>
                    <canvas id="itemLineChart"></canvas>
                </div>
            </Segment>


            <Segment style={{display:'none'}}>
                <label>Monthly barChart</label>
                <div className="input-group">
                    <Button
                        type='button'
                        displayName={t("previous")}
                        className='ui button btn-primary btn-search'
                        icon='left arrow icon'
                    // onClick={(e) => addItemToChart(e)}

                    />
                    <Button
                        type='button'
                        displayName={t("next")}
                        className='ui button btn-primary btn-search'
                        icon='right arrow icon'
                    // onClick={(e) => resetItemLineChart(e)}

                    />

                </div>
                <canvas id="myChart"></canvas>
            </Segment>

        </Form></>
    </>
}

export default Charts;
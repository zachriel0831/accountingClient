

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

    const { getAll } = useIndexedDB('Accountings');
    // const { t } = useTranslation();
    // const _this = this;
    const initialState = props.initialState;
    const [chartState, setChartState] = useState({});
    const [dimmerState, setDimmerState] = useState(false);
    // const [selectAllState, setSelectAllState] = useState(false);
    // const [checkBoxListState, setCheckBoxListState] = useState([]);
    const [optionsState, setOptionState] = useState({});
    const [yearOptionState, setYearOptionState] = useState({});
    const [yearLineChartState, setYearLineChartState] = useState([]);

    const [itemLineChartState, setItemLineChartState] = useState([]);
    // const [displayBalanceState, setDisplayBalanceState] = useState('none');

    // const [countYearState, setCountYearState] = useState(moment(new Date()).format('YYYY').toString());
    // const [countMonthState, setCountMonthState] = useState(moment(new Date()).format('MM').toString());

    const [radioGroupState, setRadioGroupState] = useState(radioBtnInitVal[0]);
    const initFormState = {
        year: moment(new Date()).format('YYYY'),

    };

    const { values, handleChange, handleSubmit, handleReset } = useForm(resetForm, submit, initFormState);

    function resetForm() {

    }

    function submit(e, formRef) {

        // let category = values.category;
        // let type = radioGroupState;
        // let date = moment(dateState).format('YYYY/MM/DD');
        // // let month = moment(dateState).format('MM');
        // // let day = moment(dateState).format('DD');
        // // let year = moment(dateState).format('YYYY');

        // let startDate = moment(startDateState).format('YYYY/MM/DD');
        // // let startMonth = moment(startDateState).format('MM');
        // // let startYear = moment(startDateState).format('YYYY');
        // // let startDay = moment(startDateState).format('DD');


        // let endDate = moment(endDateState).format('YYYY/MM/DD');
        // // let endMonth = moment(endDateState).format('MM');
        // // let endYear = moment(endDateState).format('YYYY');
        // // let endDay = moment(endDateState).format('DD');

        // let accountQueriesData = {};
        // let sumIncome = 0;
        // let sumExpenditure = 0;
    }

    const addYearToChart = (e) => {

        let years = values.years;

        generateLineChart('balanceComparisonPerMonth', '', years);

    }

    const resetYearLineChart = (e) => {

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

    const generateLineChart = (displayType, item, thisYear) => {
        let datas = { ...props.initialState };
        // let thisYear = moment().format('YYYY');
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

    const generatePieChart = (queryResults, type) => {
        //進來先秀本月支出的資料 PIE data start =====================================
        let pieData = {};
        pieData.queries = queryResults.annualDatas.filter((items, index, array) => {

            return items.type === type;
        });
        pieData.count = pieData.queries.length;
        pieData.time = moment().format('YYYY/MM/DD MM:SS');
        pieData.incomeSummary = queryResults.monthlyIncome;
        pieData.expenditureSummary = queryResults.monthlyExpenditure;

        var ctx = document.getElementById('pieChart');

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

        var pieChart = new Chart(ctx, {
            type: 'pie',
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

                events: ['mousemove', 'click', 'touchstart', 'touchmove'],
                hover: {
                    mode: 'index',
                    intersect: false
                },
                legend: {
                    display: true,
                },
                responsive: true

            }
        });
        //PIE data Ends =====================================

    }


    useEffect(() => {
        let thisYear = moment().format('YYYY');
        generateLineChart('balanceComparisonPerMonth', '', thisYear);

        let categories = config.categories;
        let categoryBox = [];
        let yearBox = [];
        let yearBoxResult = [];
        _.each(categories, (v, k) => {
            let items = {
                label: v,
                value: v
            }
            categoryBox.push(items);
        });

        getAll().then(accountinDatas => {
            _.each(accountinDatas, (v, k) => {
                if (!yearBox.includes(v.year) && !(yearBox.length === 0)) {
                    let items = {
                        label: v.year === thisYear ? v.year + '(default)' : v.year,
                        value: v.year
                    }
                    yearBox.push(v.year);
                    yearBoxResult.push(items)
                } else if (yearBox.length === 0) {


                    let items = {
                        label: v.year === thisYear ? v.year + '(default)' : v.year,
                        value: v.year
                    }
                    yearBox.push(v.year);
                    yearBoxResult.push(items)
                }
            });
            const options = {
                "seletedValue": moment(new Date()).format('YYYY'),
                "disabled": false,
                "items": [...yearBoxResult]
            };

            setYearOptionState(options);
        })

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

        //初始category items
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
        // let monthlyResult = props.getMonthlyData(datas, thisMonth);

        let annualResult = props.getAnnualData(datas, thisYear);
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

        generatePieChart(annualResult, 'expenditure');
    }, [])

    return <>
        <><Form title='Charts' onSubmit={handleSubmit} onReset={handleReset} toggleDimmer={dimmerState}>
            <Segment>

                <div className="input-group" >
                    <Select value={values.years} name='years' label='years' options={yearOptionState} onChange={handleChange} />
                </div>

                <Button
                    type='button'
                    displayName={t("add")}
                    className='ui button btn-primary btn-search'
                    icon='icon add'
                    onClick={(e) => addYearToChart(e)}

                />
            </Segment>


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


            <Segment >
                <label>pieChart</label>
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
            </Segment>
            <Segment style={{width:'800px',height:'600px'}}>
                <canvas id="pieChart"></canvas>

            </Segment>

        </Form></>
    </>
}

export default Charts;
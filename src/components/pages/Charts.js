

import React, { useState, useEffect } from 'react';
import { useIndexedDB } from 'react-indexed-db';
import Form from '../Form';
// import Text from '../Text';
// import Amount from '../Amount';
// import RadioGroup from '../RadioGroup';
import Select from '../Select'
import useForm from '../custom-hooks/useForm';
import _ from 'lodash';
import config from '../../configs/config';
import Button from '../Button';
import { useTranslation } from "react-i18next";
import moment from 'moment';
// import AccountingTable from '../AccountingTable';
// import DatePicker from '../DatePicker';
// import PureCheckBox from '../PureCheckBox';
// import { Modal } from 'semantic-ui-react';
// import EditPanel from '../modals/EditPanel';
// import validateThis from '../../validationSet/validations';
import utils from '../../utils/utils';
import { Segment } from 'semantic-ui-react';
import Chart from 'chart.js';

// const radioGroupItem = {
//     "items": [{
//         "label": "expenditure",
//         "value": "expenditure",
//         "groupKey": "_none",
//         "disabled": false
//     },
//     {
//         "label": "income",
//         "value": "income",
//         "groupKey": "_none",
//         "disabled": false
//     },],
//     "selectedValue": "expenditure"
// }

// const dataFilterRadioGroupItem = {
//     "items": [
//         {
//             "label": "this month",
//             "value": "month",
//             "groupKey": "_none",
//             "disabled": false
//         }, {
//             "label": "this year",
//             "value": "year",
//             "groupKey": "_none",
//             "disabled": false
//         },
//     ],
//     "selectedValue": "month"
// }

const Charts = (props) => {
    const { t } = useTranslation();
    const categoryDB = useIndexedDB('Accountings_Categories');

    // let radioBtnInitVal = [];
    // if (radioGroupItem) {
    //     _.each(radioGroupItem.items, (v, k) => {
    //         if (v.value === radioGroupItem.selectedValue) {
    //             radioBtnInitVal.push(v.value);
    //         }
    //     })
    // }


    // let dataFilterRadioBtnInitVal = [];
    // if (dataFilterRadioGroupItem) {
    //     _.each(dataFilterRadioGroupItem.items, (v, k) => {

    //         if (v.value === dataFilterRadioGroupItem.selectedValue) {
    //             dataFilterRadioBtnInitVal.push(v.value);
    //         }
    //     })
    // }

    const { getAll } = useIndexedDB('Accountings');
    // const { t } = useTranslation();
    // const _this = this;
    // const initialState = props.initialState;
    const [chartState, setChartState] = useState({});
    const [pieChartState, setPieChartState] = useState({});

    const [dimmerState, setDimmerState] = useState(false);
    // const [selectAllState, setSelectAllState] = useState(false);
    // const [checkBoxListState, setCheckBoxListState] = useState([]);
    const [optionsState, setOptionState] = useState({});
    const [yearOptionState, setYearOptionState] = useState({});
    // const [yearLineChartState, setYearLineChartState] = useState([]);

    const [itemLineChartState, setItemLineChartState] = useState([]);
    // const [displayBalanceState, setDisplayBalanceState] = useState('none');

    // const [countYearState, setCountYearState] = useState(moment(new Date()).format('YYYY').toString());

    const initFormState = {
        year: moment(new Date()).format('YYYY'),

    };

    const { values, handleChange, handleSubmit, handleReset } = useForm(resetForm, submit, initFormState);

    function resetForm() {

    }

    function submit(e, formRef) {


    }

    const addYearToChart = (e) => {

        let years = values.years;

        generateLineChart('balanceComparisonPerMonth', '', years);

    }

    const addItemToChart = (e) => {
        let item = values.category;
        let year = moment().format('YYYY');
        generateLineChart('itemComparisonPerMonth', item, year);
    }

    const resetItemLineChart = (e) => {

        setItemLineChartState([]);
        chartState.destroy();
        var item_ctx_line = document.getElementById("itemLineChart");

        var item_line_Chart = new Chart(item_ctx_line, {
            type: 'line',
            data: {
                labels: ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sept", "Oct", 'Nov', 'Dec'],
                datasets: []
            },
            width: 1450,
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
                    label: t('annual_expenditure'), // Name the series
                    data: monthlyExpenditureSummaryArray, // Specify the data values array
                    fill: false,
                    borderColor: '#FF0000', // Add custom color border (Line)
                    backgroundColor: '#FF0000', // Add custom color background (Points and Fill)
                    borderWidth: 1 // Specify bar border width
                });

                chartDataSetBox.push({
                    label: t('annual_income'), // Name the series
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
                        labels: ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sept", "Oct", 'Nov', 'Dec'],
                        datasets: [...chartDataSetBox]
                    },
                    width: 1450,
                    options: {
                        responsive: true, // Instruct chart js to respond nicely.
                        maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height 
                    }
                });


                break;

            case 'itemComparisonPerMonth':
                var item_ctx_line = document.getElementById("itemLineChart");
                let itemExpenditureSummaryArray = [];

                for (var j = 1; j <= 12; j++) {

                    let monthFormat = (j < 10) ? ('0' + j) : (j + '');
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
                            labels: ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sept", "Oct", 'Nov', 'Dec'],
                            datasets: [...chartDataSetBox]
                        },
                        width: 1450,
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

    const changePieChartYear = (e) => {
        let thisYear = values.pieChartYear;
        let datas = { ...props.initialState };
        let annualResult = props.getAnnualData(datas, thisYear);

        generatePieChart(annualResult, 'expenditure');
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

            if (labels.length !== 0) {
                if (labels.includes(itemCategory)) {
                    _.each(categoryBoxForPie, (v, k) => {
                        if (v.category === itemCategory) {
                            v.category = itemCategory;
                            let amount = parseInt(v.amount);
                            v.amount = (amount += parseInt(itemAmount));
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
        if (!_.isEmpty(pieChartState)) {
            pieChartState.destroy();
        }

        //generate chart
        var pieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: t('amount'),
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

        setPieChartState(pieChart);
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
                        label: v.year === thisYear ? v.year + t('default') : v.year,
                        value: v.year
                    }
                    yearBox.push(v.year);
                    yearBoxResult.push(items)
                } else if (yearBox.length === 0) {


                    let items = {
                        label: v.year === thisYear ? v.year + t('default') : v.year,
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

        //初始category items
        var item_ctx_line = document.getElementById("itemLineChart");

        var item_line_Chart = new Chart(item_ctx_line, {
            type: 'line',
            data: {
                labels: ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sept", "Oct", 'Nov', 'Dec'],
                datasets: []
            },
            width: 1450,
            options: {
                responsive: true, // Instruct chart js to respond nicely.
                maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height 
            }
        });

        setChartState(item_line_Chart);

        let datas = { ...props.initialState };
        let annualResult = props.getAnnualData(datas, thisYear);

        generatePieChart(annualResult, 'expenditure');
    }, [])

    return <>
        <><Form title={t('charts')} onSubmit={handleSubmit} onReset={handleReset} toggleDimmer={dimmerState}>
            <Segment>

                <div className="input-group" >
                    <Select value={values.years} name='years' label={t('years')} options={yearOptionState} onChange={handleChange} />
                </div>

                <Button
                    type='button'
                    displayName={t("add")}
                    className='ui button btn-primary btn-search'
                    icon='icon add'
                    onClick={(e) => addYearToChart(e)}

                />
            </Segment >

            <Segment style={{ width: '1500px', height: '200px' }}>
                <canvas id="lineChart"></canvas>
            </Segment>

            <Segment>
                <div className="input-group">
                    <Select value={values.category} name='category' label={t('category')} options={optionsState} onChange={handleChange} />
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
                <div style={{ width: '1500px', height: '200px' }}>
                    <canvas id="itemLineChart"></canvas>
                </div>
            </Segment>
            <Segment style={{ width: '800px', height: '600px' }}>
                <div className="input-group">
                    <Select value={values.pieChartYear} name='pieChartYear' label={t('pie_chart_year')} options={yearOptionState} onChange={handleChange} />
                    <Button
                        type='button'
                        displayName={t("set_year")}
                        className='ui button btn-primary btn-search'
                        icon='icon add'
                        onClick={(e) => changePieChartYear(e)}
                    />
                </div>
                <canvas id="pieChart"></canvas>
            </Segment>
        </Form></>
    </>
}

export default Charts;
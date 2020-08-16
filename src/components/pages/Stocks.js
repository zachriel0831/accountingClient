

import React, { useState, useEffect, useRef } from 'react';
import { useIndexedDB } from 'react-indexed-db';
import Form from '../Form';
import Text from '../Text';
import RadioGroup from '../RadioGroup';
import Select from '../Select'
import useForm from '../custom-hooks/useForm';
import _ from 'lodash';
// import config from '../../configs/config';
import Button from '../Button';
import { useTranslation } from "react-i18next";
import moment from 'moment';
import DatePicker from '../DatePicker';
import { Segment, Header, Card, Modal } from 'semantic-ui-react';
import axios from 'axios';
import PureCheckBox from '../PureCheckBox';
import AccountingTable from '../AccountingTable';
import Amount from '../Amount';
import validateThis from '../../validationSet/validations';
import utils from '../../utils/utils';
const propsEquality = (preProps, nextProps) => {

    if (_.isEmpty(nextProps)) {
        return true;
    }

    return false;
}

const StockModal = React.memo((props) => {

    if (_.isEmpty(props)) {
        return <></>
    }

    const [largeTableOpen, setLargeTableOpen] = useState(false);
    const { update } = useIndexedDB('Accountings_Stocks');


    const [initialState, setInitialState] = useState({

        stockCode: props[1],
        share: props[2],
        closingPrice: props[3],
        acquisitionPrice: props[5],
        date: moment(props[9], 'YYYY/MM/DD').toDate(),
        remark: props[10]

    });

    let enLarge = false;
    const modalRef = useRef();
    const { t } = useTranslation();

    //radioGroup state
    const [dimmerState, setDimmerState] = useState(false);
    // const [stockValueState, setStockValueState] = useState('');
    const { values, handleChange, handleSubmit, handleReset } = useForm(resetForm, submit, initialState);

    function resetForm(e, formRef) {

    }
    function submit(e, formRef) {
        const rowKey = props[0];
        
        values.id = rowKey;
        values.date = moment(props).format('YYYY/MM/DD');

        let date = moment().format('YYYY/MM/DD');
        let month = moment().format('MM');
        let day = moment().format('DD');
        let year = moment().format('YYYY');;
        let stockCode = values.stockCode;

        let remark = values.remark;
        let share = values.share;
        values.stockCode = stockCode ? stockCode : '';
        values.remark = remark ? remark : '';
        values.acquisitionPrice = values.acquisitionPrice + '';
        values.currentStockValue =  parseInt(share) * parseFloat(values.closingPrice);
        values.profit = props[7];
        values.roe = parseFloat(props[8].replace('%')).toFixed(2);
        values.date = date ? date : '';

        values.month = month ? month : '';
        values.day = day ? day : '';
        values.year = year ? year : '';

        let validateResult = true;

        _.each(values, (v, k) => {
            validateResult = validateThis(v, k);
            if (!validateResult) {
                alert(`${k} format error!`);
                return false;
            }
        });

        values.month = moment(values.date).format('MM');
        values.day = moment(values.date).format('DD');
        values.year = moment(values.date).format('YYYY');

        update(values).then(event => {
            // props.resetKey();
            window.location.reload();
        });
    }

    const shareChanges = (e) => {
        let val = e.currentTarget.value;
        
        let result = parseInt(val) * parseFloat(values.closingPrice);
        values.acquisitionPrice = result.toFixed(2);
        handleChange(e);
    }

    const stockOnBlur = (e) => {
        let val = e.currentTarget.value;
        let data = {};

        data.stockCode = val;
        setDimmerState(true);

        axios({
            method: 'post',
            baseURL: config.mode === 0 ? config.localTestUrl : config.backEndUrl,
            // baseURL: 'http://localhost:5000',
            url: '/stocks/get_stocks',
            'Content-Type': 'application/json',
            data: data,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            withCredentials: false,
        }).then(function (response) {
            // let responseData = response.data;
            console.log(response.data);
            let stockValue = response.data ? response.data.data : '';

            values.closingPrice = stockValue;
            values.acquisitionPrice = parseFloat(stockValue) * parseInt(values.share)
            // handle success
        }).catch(function (error) {
            // handle error
            console.log(error);
            alert('query stock value failed!')

        }).finally(function () {
            // always executed
            setDimmerState(false);

        });
    }

    const stockChanges = (e) => {
        values.closingPrice = '';
        values.share = '';
        handleChange(e);
    }

    const buyPriceChanges = (e) => {
        let stockValue = e.currentTarget.value;
        values.acquisitionPrice = parseFloat(stockValue) * parseInt(values.share)

        handleChange(e);

    }

    const closeModal = (e) => {

        setLargeTableOpen(false);
    }




    const enLargeModal = (e) => {

        let modalRefs = modalRef;

        if (!enLarge) {
            modalRefs.current.ref.current.style.height = '90%'
            modalRefs.current.ref.current.style.width = '90%'
            enLarge = !enLarge;
        } else {
            modalRefs.current.ref.current.style.height = ''
            modalRefs.current.ref.current.style.width = ''
            enLarge = !enLarge;
        }
    }

    useEffect(() => {
        setLargeTableOpen(true);
        values.stockCode = props[1];
        values.share = props[2];
        values.closingPrice = props[3];
        values.acquisitionPrice = props[5];
        values.date = moment(props[9], 'YYYY/MM/DD').toDate();
        values.remark = props[10];
        return () => {
            console.log('unmounted');
        }
    }, [props])

    return <Modal ref={modalRef} open={largeTableOpen}>
        <Modal.Header className="header">
            item details
            <div className="ui horizontal list right floated">
                <div className="item">
                    <a href="javascript:void(0)" className="btn-close-modal"><i className="external alternate icon" onClick={(e) => enLargeModal(e)}></i></a>
                </div>
                <div className="item">
                    <a href="javascript:void(0)" className="btn-close-modal" onClick={(e) => closeModal(e)}><i className="times icon"></i></a>
                </div>
            </div>
        </Modal.Header>
        <Modal.Content scrolling>
            <div className="scrolling content">
                <Form title='Stocks' onSubmit={handleSubmit} onReset={handleReset} toggleDimmer={dimmerState}>
                    <Segment>
                        <label>enter your stock code</label>
                        <div className="input-group">
                            <span>股票代號:</span>
                            <Text
                                icon='pencil alternate'
                                value={values.stockCode}
                                name='stockCode'
                                label='股票代號'
                                onChange={(e) => stockChanges(e)}
                                onBlur={stockOnBlur}
                            />
                        </div>

                        <div className="input-group">
                            <span>購入價格:</span>
                            <Text
                                value={values.closingPrice}
                                name='closingPrice'
                                label='ex:105.0'
                                onChange={buyPriceChanges}
                            />
                        </div>

                        <div className="input-group">
                            <span>股數:</span>
                            <Text
                                icon='pencil alternate'
                                value={values.share}
                                name='share'
                                label='2000'
                                onChange={shareChanges}
                            />
                            <span>預估金額:</span>
                            <Amount
                                showToolTip={false}
                                disabled
                                icon='dollar sign'
                                value={values.acquisitionPrice}
                                name='acquisitionPrice'
                                label='acquisitionPrice'
                            />

                        </div>
                        <div className="input-group">

                            <span>備註:</span>
                            <Text icon='sticky note' value={values.remark} name='remark' label='remark' onChange={handleChange} />
                        </div>
                        <div className="input-group">
                            <Button
                                type='submit'
                                displayName={t("Send")}
                                className='ui button btn-primary btn-search'
                                icon='icon search'
                            />
                        </div>
                    </Segment>
                </Form>
            </div>
        </Modal.Content>
        <Modal.Actions>
        </Modal.Actions>
    </Modal>
}, propsEquality)

const Stocks = (props) => {
    const { t } = useTranslation();
    const { add, getAll, update,deleteRecord } = useIndexedDB('Accountings_Stocks');
    //loading dimmer
    const [dimmerState, setDimmerState] = useState(false);
    const [queriesState, setQueriesState] = useState({});
    const [selectAllState, setSelectAllState] = useState(false);
    const [checkBoxListState, setCheckBoxListState] = useState([]);
    const [stockValueState, setStockValueState] = useState('');
    const [acquisitionPriceState, setAcquisitionPriceState] = useState('');
    const [trValueState, setTrValueState] = useState({});

    //form methos
    const { values, handleChange, handleSubmit, handleReset } = useForm(resetForm, submit, {});

    function resetForm() {
    }

    function submit(e, formRef) {
        let itemId = `${moment().unix()}_${values.stockCode}_${moment().format('YYYY/MM/DD')}_${acquisitionPriceState}`;
        let date = moment().format('YYYY/MM/DD');
        let month = moment().format('MM');
        let day = moment().format('DD');
        let year = moment().format('YYYY');;
        let stockCode = values.stockCode;
        if (!stockCode) {
            alert('please fill the stock column');
            return;
        }

        let remark = values.remark;
        let share = values.share;
        values.id = itemId;
        values.date = date ? date : '';
        values.stockCode = stockCode ? stockCode : '';
        values.remark = remark ? remark : '';
        values.closingPrice = stockValueState;
        values.marketPrice = stockValueState + '';
        values.acquisitionPrice = acquisitionPriceState;
        values.currentStockValue =  acquisitionPriceState;
        values.profit = 0;
        values.roe = 0;
        values.month = month ? month : '';
        values.day = day ? day : '';
        values.year = year ? year : '';

        let validateResult = true;

        _.each(values, (v, k) => {
            validateResult = validateThis(v, k);

            if (!validateResult) {
                alert(`${k} format error!`);
                return false;
            }
        });

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
        setTrValueState(trValues);
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

    const shareChanges = (e) => {
        let val = e.currentTarget.value;
        
        let result = parseInt(val) * parseFloat(stockValueState);
        setAcquisitionPriceState(result.toFixed(2));
        handleChange(e);
    }

    const stockOnBlur = (e) => {
        let val = e.currentTarget.value;
        let data = {};

        data.stockCode = val;
        setDimmerState(true);

        axios({
            method: 'post',
            baseURL: config.mode === 0 ? config.localTestUrl : config.backEndUrl,
            // baseURL: 'http://localhost:5000',
            url: '/stocks/get_stocks',
            'Content-Type': 'application/json',
            data: data,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            withCredentials: false,
        }).then(function (response) {
            // let responseData = response.data;
            console.log(response.data);
            if(response.data.error){
                alert('查詢代號發生錯誤!')
            }
            let stockValue = response.data ? response.data.data : '';
            
            setStockValueState(stockValue);
            // handle success
        }).catch(function (error) {
            // handle error
            console.log(error);
            alert('query stock value failed!')

        }).finally(function () {
            // always executed
            setDimmerState(false);

        });
    }

    const stockChanges = (e) => {
        setStockValueState('');
        setAcquisitionPriceState('');
        values.share = '';
        handleChange(e);
    }

    const refreshAll = (queries) => {
        queries = queries ? queries : queriesState.queries;
        let axiosObjects = [];
        setDimmerState(true);

        _.each(queries, (v, k) => {
            let data = {};

            data.stockCode = v.stockCode;

            axiosObjects.push(axios({
                method: 'post',
                baseURL: config.mode === 0 ? config.localTestUrl : config.backEndUrl,
                // baseURL: 'http://localhost:5000',
                url: '/stocks/get_stocks',
                'Content-Type': 'application/json',
                data: data,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
                withCredentials: false,
            }).then(function (response) {

                let stockValue = response.data ? response.data.data : '';
                let shares = v.share;
                let currentStockValue = parseInt(shares) * parseFloat(stockValue);
                v.marketPrice = stockValue;
                v.currentStockValue = currentStockValue.toFixed(2);
                v.profit = parseInt(currentStockValue) - parseInt(v.acquisitionPrice);
                v.roe = ((currentStockValue / parseInt(v.acquisitionPrice) * 100) - 100).toFixed(2) + '%';
                update(v) 


            }).catch(function (error) {
                // handle error
                console.log(error);
                alert('query stock value failed!')
            }));
        });

        Promise.all(axiosObjects).then(function (values) {
            let stockDataData = {};
            let resultQueries = [...queries]

            stockDataData.queries = resultQueries;
            stockDataData.time = moment().format('YYYY/MM/DD MM:SS')
            stockDataData.count = queries.length;

            setQueriesState(stockDataData);
            setDimmerState(false);
        });
    }

    useEffect(() => {
        getAll().then(stockData => {
            refreshAll(stockData)
        })
    }, []);

    const headerSpec = {
        header: [
            { id: 'id', headerName: 'id', style: { display: 'none' } },
            { id: 'stockCode', headerName: '股票代號' },
            { id: 'share', headerName: '股數' },
            { id: 'closingPrice', headerName: '成交均價' },
            { id: 'marketPrice', headerName: '市價' },
            { id: 'acquisitionPrice', headerName: '成交價格' },
            { id: 'currentStockValue', headerName: '預估現值' },
            { id: 'profit', headerName: '預估損益' },
            { id: 'roe', headerName: '報酬率' },
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
        selectedValue: true,
        queryUrl: '/',
        method: 'POST',
        requestDataKey: 'id',
        customOnRowDoubleClick: doubleClick,
    }

    return <>
        <Form title='Stocks' onSubmit={handleSubmit} onReset={handleReset} toggleDimmer={dimmerState}>
            <Segment>
                <label>enter your stock code</label>
                <div className="input-group">
                    <span>股票代號:</span>
                    <Text
                        icon='pencil alternate'
                        value={values.stockCode}
                        name='stockCode'
                        label='股票代號'
                        onChange={(e) => stockChanges(e)}
                        onBlur={stockOnBlur}
                    />
                </div>

                <div className="input-group">
                    <span>購入價格:</span>
                    <Text
                        value={stockValueState}
                        name='closingPrice'
                        label='ex:105.0'
                        onChange={handleChange}
                        showToolTip={false}
                        disabled

                    />
                </div>

                <div className="input-group">
                    <span>股數:</span>
                    <Text
                        icon='pencil alternate'
                        value={values.share}
                        name='share'
                        label='2000'
                        onChange={shareChanges}
                    />
                    <span>預估金額:</span>
                    <Amount
                        showToolTip={false}
                        disabled
                        icon='dollar sign'
                        value={acquisitionPriceState}
                        name='acquisitionPrice'
                        label='acquisitionPrice'

                    />

                </div>
                <div className="input-group">

                    <span>備註:</span>
                    <Text icon='sticky note' value={values.remark} name='remark' label='remark' onChange={handleChange} />
                </div>
                <div className="input-group">
                    <Button
                        type='submit'
                        displayName={t("Send")}
                        className='ui button btn-primary btn-search'
                        icon='icon search'
                    />
                </div>
            </Segment>

            <Segment className='accounting-table'>
                <Button
                    type='button'
                    displayName={t("Delete")}
                    className='ui button btn-primary '
                    icon='icon times circle'
                    onClick={(e) => deleteItems(e)}

                />
                <Button
                    type='button'
                    displayName={t("refreshAll")}
                    className='ui button btn-primary '
                    icon='icon times circle'
                    onClick={() => refreshAll()}

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
        </Form>

        <StockModal  {...trValueState} />
    </>
}

export default Stocks;
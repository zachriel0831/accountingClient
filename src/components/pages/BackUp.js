

import React, { useState, useEffect } from 'react';
import { useIndexedDB } from 'react-indexed-db';
import Form from '../Form';
import Text from '../Text';
// import Amount from '../Amount';
// import RadioGroup from '../RadioGroup';
// import Select from '../Select'
import useForm from '../custom-hooks/useForm';
import _ from 'lodash';
import config from '../../configs/config';
import Button from '../Button';
import { useTranslation } from "react-i18next";
// import moment from 'moment';
// import AccountingTable from '../AccountingTable';
// import DatePicker from '../DatePicker';
// import PureCheckBox from '../PureCheckBox';
// import { Modal } from 'semantic-ui-react';
// import EditPanel from '../modals/EditPanel';
// import validateThis from '../../validationSet/validations';
// import utils from '../../utils/utils';
import { Segment } from 'semantic-ui-react';
import axios from 'axios';

const BackUp = (props) => {
    const { t } = useTranslation();
    const { update } = useIndexedDB('Accountings');
    const categoryDB = useIndexedDB('Accountings_Categories');
    const stockDB = useIndexedDB('Accountings_Stocks');
    const currencyDB = useIndexedDB('Accountings_Currencies');

    const initFormState = props.initialState;

    const [dimmerState, setDimmerState] = useState(false);
    const [uuidKeyState, setUUIDKeyState] = useState('');
    const [backUpDatasState, setBackUpdataState] = useState(initFormState);
    const { values, handleChange, handleSubmit, handleReset } = useForm(resetForm, submit, {});

    function resetForm() {
    }

    function submit(e, formRef) {
    }

    useEffect(() => {
        categoryDB.getAll().then(categories => {

            backUpDatasState.categories = categories;
            setBackUpdataState(backUpDatasState);

        })
        stockDB.getAll().then(stocks => {

            backUpDatasState.stocks = stocks;
            setBackUpdataState(backUpDatasState);
        })

        currencyDB.getAll().then(currencies => {

            backUpDatasState.currencies = currencies;
            setBackUpdataState(backUpDatasState);
        })
    }, [])

    const uploadDatas = (e) => {
        let accounting = {};

        if (_.isEmpty(uuidKeyState)) {

            alert('please input serial key!');

            return;
        }
        accounting.uuidKey = uuidKeyState;
        let data = backUpDatasState;


        accounting.data = JSON.stringify(initFormState);
        setDimmerState(true);
        axios({
            method: 'post',
            baseURL: config.mode === 0 ? config.localTestUrl : config.backEndUrl,
            url: '/BackUp/Saving_BackUp_Datas',
            'Content-Type': 'application/json',
            data: accounting,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            withCredentials: false,
        }).then(function (response) {
            // let responseData = response.data;
            console.log(response.data);
            alert('updload success!')
            // handle success
        }).catch(function (error) {
            // handle error
            console.log(error);
            alert('upload failed!')

        }).finally(function () {
            // always executed
            setDimmerState(false);

        });
    }

    const getUUID = (e) => {
        setDimmerState(true);

        axios({
            method: 'get',
            baseURL: config.mode === 0 ? config.localTestUrl : config.backEndUrl,
            url: '/BackUp/Initital_BackUp_UUID',
            'Content-Type': 'application/json',
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            withCredentials: false,
        }).then(function (response) {
            let uuid = response.data;
            console.log(response);

            // handle success
            setUUIDKeyState(uuid);

        }).catch(function (error) {
            // handle error
            console.log(error);
            alert('connection failed!')

        }).finally(function () {
            // always executed
            setDimmerState(false);

        });
    }

    const synchronizeData = (e) => {

        if (_.isEmpty(values.synchronizeKey)) {
            alert('please input serial key!');
            return;
        }
        setDimmerState(true);

        let data = {}
        let uuidKey = values.synchronizeKey;

        data.uuidKey = uuidKey;

        axios({
            method: 'post',
            baseURL: config.mode === 0 ? config.localTestUrl : config.backEndUrl,
            url: '/BackUp/Get_BackUp_Datas',
            'Content-Type': 'application/json',
            data: data,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            withCredentials: false,
        }).then(function (response) {
            let responseData = JSON.parse(response.data.data);

            if (responseData) {
                alert('download successful!')

                _.each(responseData.queries, (v, k) => {
                    update(v).then(
                        event => {
                            console.log('ID Generated: ', event.target);
                        },
                        error => {
                            alert('back up failed!')

                            console.log(error);
                        }
                    );
                });

                
                _.each(responseData.stocks, (v, k) => {
                    stockDB.update(v).then(
                        event => {
                            console.log('ID Generated: ', event.target);
                        },
                        error => {
                            alert('back up failed!')

                            console.log(error);
                        }
                    );
                });

                _.each(responseData.currencies, (v, k) => {
                    currencyDB.update(v).then(
                        event => {
                            console.log('ID Generated: ', event.target);
                        },
                        error => {
                            alert('back up failed!')

                            console.log(error);
                        }
                    );
                })

                _.each(responseData.categories, (v, k) => {
                    categoryDB.update(v).then(
                        event => {
                            console.log('ID Generated: ', event.target);
                        },
                        error => {
                            alert('back up failed!')

                            console.log(error);
                        }
                    );
                })
            } else {

                alert('back up failed!')
            }

            // handle success
        }).catch(function (error) {
            // handle error
            console.log(error);
            alert('back up failed!')

        }).finally(function () {
            // always executed
            setDimmerState(false);

        });

    }

    useEffect(() => {

    }, [])
    return <>
        <><Form title={t('backUp')} onSubmit={handleSubmit} onReset={handleReset} toggleDimmer={dimmerState}>
            <Segment>
                <label>{t('uploading_your_datas')}</label>

                <Text
                    size='40'
                    value={uuidKeyState}
                    icon='pencil alternate'
                    name='serialNumber'
                    label={t('paste_your_serial_key_to_update_or_save_data')}
                    maxLength='50'
                    onChange={(e) => {
                        let val = e.currentTarget.value;
                        setUUIDKeyState(val);
                    }}
                />

                <div className="input-group">
                    <Button
                        type='submit'
                        icon='cloud upload'
                        className='ui button btn-primary btn-search'
                        displayName={t('upload')}
                        onClick={(e) => uploadDatas(e)}
                    />
                </div>
            </Segment>
            <Segment>
                <label>{t('did_not_have_one_get_serial_key_first')}</label>
                <div className="input-group">
                    <Button
                        type='submit'
                        icon='key'
                        className='ui button btn-primary btn-search'
                        displayName={t('get_key')}
                        onClick={(e) => getUUID(e)}
                    />
                </div>

            </Segment>
            <Segment>
                <label>{t('already_have')}</label>
                <div className="input-group">
                    <Text
                        value={values.synchronizeKey}
                        name='synchronizeKey'
                        size='40'
                        icon='pencil alternate'
                        label={t('paste_serial_key_here')}
                        onChange={handleChange}
                        maxLength='50'
                    />
                </div>

                <div className="input-group">
                    <Button
                        type='submit'
                        icon='key'
                        className='ui button btn-primary btn-search'
                        displayName={t('get_datas')}
                        onClick={(e) => synchronizeData(e)}
                    />
                </div>
            </Segment>
        </Form></>
    </>
}

export default BackUp;
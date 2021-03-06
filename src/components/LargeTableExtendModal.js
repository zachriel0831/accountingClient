import React, { useState, useRef } from 'react';
import _ from 'lodash';
import { useIndexedDB } from 'react-indexed-db';
import { Modal } from 'semantic-ui-react';
import Button from '../components/Button';
// import AjaxWrapper from '../utils/AjaxWrappers';
// import config from '../configs/config';
import Form from './Form';
import Text from './Text';
import Amount from './Amount';
import RadioGroup from './RadioGroup';
import Select from './Select'
import useForm from './custom-hooks/useForm';
import { useTranslation } from "react-i18next";
import moment from 'moment';
import DatePicker from './DatePicker';
import validateThis from '../validationSet/validations';
import utils from '../utils/utils';

const LargeTableExtendModal = React.memo((props) => {

    const rowKey = props.rowKey;
    const [largeTableOpen, setLargeTableOpen] = useState(false);
    let modalType = props.largeModalType;
    let dbType = '';
    switch (modalType) {
        case 'accounting':
            dbType = 'Accountings'
            break;
        case 'currency':
            dbType = 'Accountings_Currencies'
            break;

        default:
            dbType = 'Accountings'

            break;
    }
    const { update } = useIndexedDB(dbType);

    const [initialState, setInitialState] = useState({

        type: props.trElements[1],
        category: props.trElements[2],
        amount: props.trElements[3],
        date: moment(props.trElements[4], 'YYYY/MM/DD').toDate(),
        remark: props.trElements[5]

    });

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
        "selectedValue": props.trElements[1]
    }

    let enLarge = false;
    const modalRef = useRef();
    const { t } = useTranslation();

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
    const [tableDateState, setTableDateState] = useState(initialState.tableDate ? moment(initialState.tableDate, 'YYYY/MM/DD').toDate() : new Date());
    const [dimmerState, setDimmerState] = useState(false);

    const { values, handleChange, handleSubmit, handleReset } = useForm(resetForm, submit, initialState);

    function resetForm(e, formRef) {

    }
    function submit(e, formRef) {

        values.id = rowKey;
        values.date = moment(tableDateState).format('YYYY/MM/DD');

        if (props.largeModalType === 'accounting') {
            values.type = radioGroupState;
        }
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
        values.amount = values.amount.replace(/,/g, '');
        values.month = moment(values.date).format('MM');
        values.day = moment(values.date).format('DD');
        values.year = moment(values.date).format('YYYY');

        update(values).then(event => {

            props.resetKey();
        });
    }

    const closeModal = (e) => {

        setLargeTableOpen(false);
    }

    const openModal = async (e) => {
        let nameChecking = e.target.parentElement.getAttribute('name');

        if (nameChecking && nameChecking.indexOf('largeModal') !== -1) {
            setLargeTableOpen(true);
            props.onDoubleClick(e);
        }
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

    return (
        <Modal ref={modalRef} open={largeTableOpen} trigger={
            // <td>
            <tr id={props.rowKey}
                key={utils.generateUID()}
                name={props.rowKey + '-largeModal'}
                style={props.style}
                onDoubleClick={(e) => openModal(e)}
            >
                {props.children}
            </tr>
            //  </td>
        }>
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
                    <Form onSubmit={handleSubmit} onReset={handleReset} toggleDimmer={dimmerState}>
                        {(props.largeModalType === 'accounting')
                            ?
                            <div className="input-group">
                                <RadioGroup
                                    name='type'
                                    radioData={radioGroupItem}
                                    onClick={(val) => {
                                        setRadioGroupState(val)
                                    }} />
                            </div>
                            :
                            <></>
                        }
                        <div className="input-group">
                            <DatePicker
                                name='tableDate'
                                label={t("date")}
                                selected={tableDateState}
                                onChange={(date) => {
                                    setTableDateState(date);
                                }}
                            />

                        </div>
                        <div className="input-group">
                            <Select value={values.category} name='category' label='category' options={props.categoryOptions} onChange={handleChange} />
                        </div>

                        <div className="input-group">
                            <Amount icon='dollar sign' value={values.amount} name='amount' label='amount' onChange={handleChange} />
                        </div>

                        <div className="input-group">
                            <Text icon='sticky note' value={values.remark} name='remark' label='remark' onChange={handleChange} />
                        </div>
                        <Button type='button' displayName='update' className='ui button btn-primary btn-search' icon='icon search' onClick={(e) => submit(e, {})} />
                        <Button type='cancel' displayName='cancel' className="ui cancel button" onClick={(e) => closeModal(e)} />
                    </Form>
                </div>
            </Modal.Content>
            <Modal.Actions>
            </Modal.Actions>
        </Modal>
    )
})
export default LargeTableExtendModal;


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

const queriesData = {
    queries: [
        {
            id: '124',
            type: 'expenditure',
            category: 'bill',
            amount: '124',
            date: '20122222',
            remark: 'for test'
        },
        {
            id: '124',
            type: 'expenditure',
            category: 'bill',
            amount: '124',
            date: '20122222',
            remark: 'for test'
        },
        {
            id: '124',
            type: 'expenditure',
            category: 'bill',
            amount: '124',
            date: '20122222',
            remark: 'for test'
        }
    ],
    count: 3,
    time: '2022222'
}

const propsEquality = (preProps, nextProps) => {

    if (preProps.editState !== nextProps.editState) {
        return false;
    } else if (preProps.openEditModalState !== nextProps.openEditModalState) {

        return false;
    } else if (preProps.modalClose !== nextProps.modalClose) {
        return false;
    }
    // 
    return true;
}



const EditPanel = (props) => {
    const { t } = useTranslation();
    const resetRef = useRef();
    const modalRef = useRef();
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

    const initialState = {
        type: props.editState[1],
        category: props.editState[2],
        amount: props.editState[3],
        date: props.editState[4],
        remark: props.editState[5]


    };

    const item_key = props.editState[0];

    // const [initialState, setInitialState] = useState({});

    const [dateState, setDateState] = useState(initialState.date ? moment(initialState.date, 'YYYY/MM/DD').toDate() : new Date());
    const [formState, setFormState] = useState((<></>));
    let enLarge = false;

    const [dimmerState, setDimmerState] = useState(false);

    // const [largeTableOpen, setLargeTableOpen] = useState(false);
    const { values, handleChange, handleSubmit, handleReset } = useForm(resetForm, submit, initialState);


    // useEffect(() => {
    //     const initState = {
    //         type: props.editState[1],
    //         category: props.editState[2],
    //         amount: props.editState[3],
    //         date: props.editState[4],
    //         remark: props.editState[5]
    //     };
    //     setInitialState(initState);
    //     
    // }, [(props.modalOpen === true)]);

    useEffect(() => {
        let f = initialState;
        let g = values;
        
    }, [initialState]);


    const closeModal = (e) => {

        // setLargeTableOpen(false);
        props.modalClose(false);

        resetRef.current.click();

    }


    function resetForm(e, formRef) {


    }
    function submit(e, formRef) {

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
        <Modal ref={modalRef} open={props.modalOpen}>
            <Modal.Header className="header">
                ({props.rowKey})
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
                <Form onSubmit={handleSubmit} onReset={handleReset} toggleDimmer={dimmerState}>
                    <div className="input-group">
                        <RadioGroup
                            name='type'
                            radioData={radioGroupItem}
                            onClick={(val) => {
                                setRadioGroupState(val)
                            }} />
                    </div>

                    <div className="input-group">
                        <DatePicker
                            name='date'
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
                        <Amount icon='dollar sign' value={values.amount} name='amount' label='amount' onChange={handleChange} />
                    </div>

                    <div className="input-group">
                        <Text icon='sticky note' value={values.remark} name='remark' label='remark' onChange={handleChange} />
                    </div>
                    <div style={{ display: 'none' }}>
                        <button ref={resetRef} type='reset' />
                    </div>
                    {formState}
                </Form>
            </Modal.Content>
            <Modal.Actions>


            </Modal.Actions>

        </Modal>
    )
};

export default EditPanel;
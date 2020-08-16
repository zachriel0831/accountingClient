import React from 'react'
import Datepicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import _ from 'lodash';
// import moment from 'moment';
import HOCCommon from './hocs/HOCCommon';

import { zhTW } from 'date-fns/locale';
registerLocale("zhTW", zhTW);

const DatePicker = (props) => {

    const changeValue = (val) => {
        // let currentValue = moment(val).format('YYYY/MM/DD');
        // let validateResult = props.doValidate(currentValue, props);
        // if (!validateResult.status) {
        //     alert(validateResult.msg)
        //     return;
        // }

        if (_.isFunction(props.onChange)) {
            //TODO 先不回傳 format過後的date 以利其他交易做各自需求 zack
            props.onChange(val);
        }
    }

    return (
        <>
            <label ref={(node) => {
                if (node && props.labelStyle) {
                    if (props.labelStyle.width) {
                        node.style.setProperty("width", props.labelStyle.width, "important");
                    }
                }
            }}
                style={props.labelStyle} htmlFor="">{props.label}</label>

            <div className="six wide field">

                <Datepicker
                    name='datepicker'
                    locale="zhTW"
                    selected={props.selected}
                    dateFormat='yyyy/MM/dd'
                    onChange={changeValue} />
            </div>
        </>

    )
}

//props 預設值
DatePicker.defaultProps = {
    componentType: 'datepicker',
    label: '',
    selected: '',
}

export default HOCCommon(DatePicker);
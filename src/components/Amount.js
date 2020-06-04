import React, { useState, useEffect } from 'react';
import HOCCommon from './hocs/HOCCommon';

const Amount = (props) => {

    const [state, setState] = useState(props.value);

    const transferToAmountFormat = (val, decimalPoint) => {
        if (!val)
            return;

        let justNumbers = val.replace(/[^01234567890\.]/g, "");
        let decimalRegex = /(\d{0,})(\.(\d{1,})?)?/g

        let decimalPartMatches = decimalRegex.exec(justNumbers);
        let decimalPart = "";
        let withoutDecimal = "";
        if (props.decimal) {

            //先把小數點分隔出來
            if (decimalPartMatches[2]) {
                decimalPart = decimalPartMatches[2];
            }
        }
        withoutDecimal = decimalPartMatches[1];

        let final = '';

        //加上千分位
        final += withoutDecimal.replace(/\B(?=(\d{3})+(?!\d))/g, ",")

        if (props.decimal) {
            final += decimalPart ? decimalPart : '.00';
        }
        return final;
    }


    const blurValue = (e) => {
        let currentValue = e.currentTarget.value;
        // if (currentValue.indexOf('.') <= -1) {
        currentValue = transferToAmountFormat(currentValue, 1);

        // }
        setState(currentValue);
        if (props.onBlur) {
            props.onBlur(e, currentValue);
        }
    }

    const changeValue = (e) => {
        let currentValue = e.currentTarget.value;
        var acceptDeciaml = 0;
        if (props.decimal) {
            acceptDeciaml = props.decimalLength;
        } else {
            currentValue = transferToAmountFormat(currentValue, 1);
        }

        console.log('currentValue ', currentValue);
        setState(currentValue);
        //若有Change事件，在此時觸發
        if (props.onChange) {
            props.onChange(e);
        }
    }

    return (
        <>
            <div className={`ui ${props.disabled ? 'disabled' : ''}left icon input`}>
                <input
                    type='text'
                    value={state}
                    name={props.name}
                    minLength={props.minLength}
                    maxLength={props.maxLength}
                    onBlur={blurValue}
                    onChange={changeValue}
                    placeholder={props.label}
                    readOnly={props.disabled}
                    size={props.size}
                    style={{ textAlign: 'right' }}
                />
                <i aria-hidden="true" className={`${props.icon} icon`}></i>

            </div>
        </>
    );
};

//props 預設值
Amount.defaultProps = {
    componentType: 'amount',
    maxLength: 10,
    name: '',
    minLength: 0,
    disabled: false,
    placeholder: '',
    value: '',
    decimal: false,
    decimalLength: 2,
    size: 10,
    labelStyle: {}

}

export default HOCCommon(Amount);
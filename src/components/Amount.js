import React, { useState, useEffect } from 'react';
import HOCCommon from './hocs/HOCCommon';

const Amount = (props) => {

    const [state, setState] = useState(props.value);

    const transferToAmountFormat = (val, decimalPoint) => {
        let justNumbers = val.replace(/[^01234567890\.]/g, "");
        // let newVal = parseFloat(justNumbers);
        let decimalRegex = /(\d{0,})(\.(\d{1,})?)?/g

        let decimalPartMatches = decimalRegex.exec(justNumbers);
        // let decimalPart = "";

        //先把小數點分隔出來
        // if (decimalPartMatches[2]) {
        //   decimalPart = decimalPartMatches[2];
        // }
        let withoutDecimal = decimalPartMatches[1];
        let final = '';

        //加上千分位
        final += withoutDecimal.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        // final += decimalPart ? decimalPart : '.00';

        // final = (val).toFixed(decimalPoint).replace(/\d(?=(\d{3})+\.)/g, '$&,')

        return final;
    }


    const blurValue = (e) => {
        let currentValue = e.currentTarget.value;
        if (currentValue.indexOf('.') <= -1) {
            currentValue = transferToAmountFormat(currentValue, 1);

        }
        setState(currentValue);
        if (props.onBlur) {
            props.onBlur(e, currentValue);
        }
    }

    const changeValue = (e) => {
        let currentValue = e.currentTarget.value;

        if (currentValue.indexOf('.') <= -1) {
            currentValue = transferToAmountFormat(currentValue, 1);
        }

        var acceptDeciaml = 0;
        var regObject = '';

        if (props.decimal) {
            acceptDeciaml = props.decimalLength;
            regObject = new RegExp(`^(?!0\\.00)[0-9]\\d{0,2}(,\\d{3})*(\\.\\d{0,${acceptDeciaml}})?$`);
        } else {
            //    /^(?!0\.00)[0-9]\d{0,2}(,\d{3})*(\.\d*)?$/
            regObject = new RegExp('(?!0\.00)[0-9]\d{0,2}(,\d{3})?$');
        }
        if (!(regObject.test(currentValue)) && currentValue !== '') {
            console.log(regObject)

            console.log('[' + currentValue + '] is not amount!!')
            return false;
        }

        setState(currentValue);
        //若有Change事件，在此時觸發
        if (props.onChange) {
            props.onChange(e);
        }
    }

    useEffect(() => {

        let val = transferToAmountFormat(props.value);
        setState(val)
        return () => {
            console.log('amount unmounting');
        };
    }, [props.value])

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
                <i aria-hidden="true" class={`${props.icon} icon`}></i>

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
    decimal: true,
    decimalLength: 2,
    size: 10,
    labelStyle: {}

}

export default HOCCommon(Amount);
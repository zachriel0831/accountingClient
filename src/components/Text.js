
import React, { useRef } from 'react';
import HOCCommon from './hocs/HOCCommon';
import _ from 'lodash';

const Text = (props) => {
    const inputRef = useRef();

    const changeValue = (e) => {
        // let currentValue = e.currentTarget.value;

        if (_.isFunction(props.onChange)) {
            props.onChange(e);
        }
    }

    const componentBlur = (e) => {
        // let currentValue = e.currentTarget.value;
        if (_.isFunction(props.onBlur)) {
            props.onBlur(e);
        }
    }

    return (
        <>
            <div className={`ui ${props.disabled ? 'disabled' : ''} left icon input`}>
                <input
                    type='text'
                    ref={inputRef}
                    name={props.name}
                    value={props.value}
                    minLength={props.minLength}
                    maxLength={props.maxLength}
                    onChange={changeValue}
                    onBlur={componentBlur}
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
Text.defaultProps = {
    componentType: 'text',
    maxLength: 30,
    name: '',
    minLength: 0,
    disabled: false,
    placeholder: '',
    value: '',
    size: 10,
    labelStyle: {}
}

export default HOCCommon(Text);
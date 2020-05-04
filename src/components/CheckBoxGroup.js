import React, { useRef, useState, useEffect } from 'react';
import HOCCommon from './hocs/HOCCommon';
import _ from 'lodash';

const CheckBoxWLabel = React.memo((props) => {
    const [state, setState] = useState(props.checked ? true : false);
    /*eslint-disabled */
    const [disableState, setDisableState] = useState(props.disabled);

    const clickValue = (e) => {
        let checkBoxGroupRef = props.checkBoxRef;
        let checkBoxValue = [];
        if (checkBoxGroupRef) {
            let groupChildren = checkBoxGroupRef.current.children

            _.each(groupChildren, (v, k) => {

                let checked = v.firstChild.checked;
                let val = v.firstChild.value;
                if (checked) {
                    checkBoxValue.push(val);
                }

            })
        }

        setState(!state);
        // let validateResult = props.doValidate(currentValue, props);

        // if (!validateResult.status) {
        //     alert(validateResult.msg)
        //     return;
        // }

        if (_.isFunction(props.onClick)) {
            props.onClick(checkBoxValue);
        }
    }
    return (
        <div className={`ui ${props.disabled ? 'disabled' : ''} checkbox`}>
            <input type="checkbox"
                id={props.id}
                checked={state}
                disabled={disableState}
                name={props.name}
                value={props.value}
                onClick={clickValue} />

            <label for={props.id}>{props.label}</label>
        </div>

    )
});

const CheckBoxGroup = React.memo((props) => {

    let checkBoxContents = [];
    const checkBoxRef = useRef();
    const clickValue = (checkboxValue) => {
        if (_.isFunction(props.onClick)) {
            props.onClick(checkboxValue);
        }
    }

    if (props.checkBoxData.items) {
        _.each(props.checkBoxData.items, (v, k) => {

            checkBoxContents.push(
                <CheckBoxWLabel
                    checkBoxRef={checkBoxRef}
                    id={`${props.name}_${v.value}`}
                    name={props.name}
                    value={v.value}
                    label={v.label}
                    checked={v.checked}
                    onClick={clickValue}
                    disabled={v.disabled}
                />
            )
        })
    }
    useEffect(() => {
        // _.each(props.checkBoxData.items, (v, k) => {
        //TODO
        // if(v.checked){
        // setState(true);
        // }else{
        //     setState(false);
        // }
        // })
    }, [])
    return (
        <div ref={checkBoxRef} className="inline fields">
            {checkBoxContents}
        </div>
    );
});

//props 預設值
CheckBox.defaultProps = {
    componentType: 'CheckBox',
    name: '',
    disabled: false,
    label: '',
    value: '',
    checkBoxData: { items: [] },

}

export default WithComponents(CheckBoxGroup);

import React, { useEffect, useRef } from 'react';
import HOCCommon from './hocs/HOCCommon';
import _ from 'lodash';
import { useTranslation } from "react-i18next";
import utils from '../utils/utils';

const Select = (props) => {
    const { t } = useTranslation();
    const selectRefs = useRef();
    let options = [];
    options.push(<option key={utils.generateUID()} value=''>{t("select")}</option>);

    _.each(props.options.items, (v, k) => {
        
        if (props.value === v.value) {
            options.push(<option key={utils.generateUID()} value={v.value} selected>{v.label}</option>)

        } else {
            options.push(<option key={utils.generateUID()} value={v.value}>{v.label}</option>)
        }
    });

    useEffect(() => {

        return () => {
            console.log('select componentWillUnmount')
        };
    }, [props.options])



    const changeValue = (e) => {
        let currentValue = e.currentTarget.value;
        // let validateResult = props.doValidate(currentValue, props);
        // if (!validateResult.status) {
        //     alert(validateResult.msg)
        // }
        if (_.isFunction(props.onChange)) {
            props.onChange(e);
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
            <div className="two wide field">
                <select
                    defaultValue={props.value}
                    ref={selectRefs}
                    className={`ui dropdown ${props.disabled ? 'disabled' : ''}`}
                    name={props.name}
                    onChange={changeValue}>
                    {options}
                </select>
            </div>
        </>
    );
};

//props 預設值
Select.defaultProps = {
    label: '',
    componentType: 'select',
    name: '',
    disabled: false,
    expand: false,
    labelStyle: {},
    options: { items: [] },

}

export default HOCCommon(Select);

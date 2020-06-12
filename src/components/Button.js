import React from 'react'
import _ from 'lodash'
const Button = (props) => {
    let btnType = props.type;

    const btnClick = (e) => {
        
        if (_.isFunction(props.onClick)) {

            props.onClick(e);
        }
    }

    switch (btnType) {

        case 'query':
            break;
        case 'submit':
            break;

        case 'print':
            break

        case 'reset':

            break;
        default:
            break;
    }

    return (
        <>
            <button disabled={props.disabled} type={props.type} className={props.className} onClick={btnClick}><i className={props.icon} ></i> {props.displayName}</button>
        </>
    )
}

Button.defaultProps = {
    type: 'button',
    className: '',
    icon: '',
    btnType: 'query',
    disabled: false
}

export default Button;

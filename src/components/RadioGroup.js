import React, {useEffect , useRef} from 'react';
import HOCCommon from './hocs/HOCCommon';
import _ from 'lodash';
const RadioBtn = React.memo((props) => {
    // const [state, setState] = useState(props.checked);
    let radioRef = useRef();

    const clickValue = (e) => {
        let currentValue = e.currentTarget.value;
        
        if (_.isFunction(props.onClick)) {
            // setState(!state);
            props.onClick(currentValue);
        }
    }

    useEffect(() => {
        if(props.checked){
            // $(`#${props.value}`).click();
            let clickThisRef = radioRef.current;
            clickThisRef.checked = true;
        }
    }, [])
    
    return (
        <div className="field">
            <div className={`ui radio ${props.disabled ? 'disabled':''} checkbox`}>
                <input type="radio"
                    disabled={props.disabled} 
                    ref={radioRef}
                    id={props.value}
                    name={props.name}
                    value={props.value}
                    onClick={clickValue} />
                <label for={props.value}>{props.label}</label>
            </div>
        </div>

    )
})

const RadioGroup = React.memo((props) => {
    const clickValue = (currentValue) => {
        // let currentValue = e.currentTarget.value;
        // let validateResult = props.doValidate(currentValue, props);

        // if (!validateResult.status) {
        //     alert(validateResult.msg)
        //     return;
        // }
        // props.radioData.selectedValue = e.currentTarget.value;
        
        if (_.isFunction(props.onClick)) {
            props.onClick(currentValue);
        }
    }

    let radioContents = [];

    if (props.radioData.items) {
        _.each(props.radioData.items, (v, k) => {
            let checked = props.radioData.selectedValue === v.value ? true : false;
            radioContents.push(
                <RadioBtn
                    value={v.value}
                    label={v.label}
                    name={props.name}
                    checked={checked}
                    onClick={clickValue}
                    disabled={v.disabled}
                />
            )
        })
    }

    return (
        <div className="inline fields">
            {radioContents}
        </div>
    );
});

//props 預設值
RadioGroup.defaultProps = {
    componentType: 'RadioGroup',
    name: '',
    checked: false,
    disabled: false,
    label: '',
    value: ''
}

export default HOCCommon(RadioGroup);
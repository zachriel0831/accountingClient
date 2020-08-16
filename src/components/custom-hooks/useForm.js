import { useState } from 'react';
import _ from 'lodash';
const useForm = (resetCallback, callback, initialState) => {

    //初始form的資料 TODO 待交易規格做修改
    const [values, setValues] = useState(initialState);

    const handleSubmit = (event, formRef) => {
        //不要重複上送

        if (event) event.preventDefault();
        if (!formRef) formRef = {};

        callback(event, formRef);
    };

    const handleChange = (event) => {
        
        //讓值可以非同步的存取
        event.persist();
        setValues(values => ({ ...values, [event.target.name]: event.target.value }));
    };

    const handleReset = (event, formRef) => {
        event.persist();
        let formElements = formRef.current.elements;

        _.each(formElements, (v, k) => {
            let tagName = v.tagName;


            if (tagName === 'INPUT' || tagName === 'SELECT') {
                setValues(values => ({ ...values, [v.name]: '' }));
            }
        });

        resetCallback();
    }

    return {
        handleReset,
        handleChange,
        handleSubmit,
        values,
    }
};

export default useForm;
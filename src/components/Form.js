
import React, { useRef } from 'react';
import _ from 'lodash';
import { Dimmer, Loader } from 'semantic-ui-react'

const Form = (props) => {
    const formRef = useRef();
    const formSubmit = (e) => {
        //將form ref傳出去 以利之後submit前針對form input的處理
            
        props.onSubmit(e, formRef)
    }

    const formReset = (e) => {
        //將form ref傳出去 以利之後submit前針對form input的處理
        props.onReset(e, formRef)
    }
    return (
        <div className="query__form__wrap">
            <Dimmer active={props.toggleDimmer} inverted>
                <Loader>Loading</Loader>
            </Dimmer>

            <h2 className="sys__func__title">{props.title}</h2>
            <form ref={formRef} onSubmit={formSubmit} onReset={formReset}>
                <div className="ui form">
                    <div className="form row">
                        {props.children}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Form;
import React from 'react';

import { Formik, Form } from 'formik';

export default class AccountForm extends React.Component {

    handleSubmit(val) {
        this.props.onSubmit(val);
        document.getElementById("resetBtn").click();

    }
    
    render() {
        return (
            <Formik
                initialValues={this.props.model}
                ref='formik'
                render={({ 
                    errors, 
                    status, 
                    isValid,
                    dirty,
                    touched, 
                    isSubmitting, 
                    handleReset,
                    values
                }) => (
                    <Form>
                        {this.props.children}
                    <ul>
                        <li>errors: {JSON.stringify(errors)}</li>
                        <li>isValid: {JSON.stringify(isValid)}</li>
                        <li>dirty: {JSON.stringify(dirty)}</li>
                        <li>touched: {JSON.stringify(touched)}</li>
                        <li>isSubmitting: {JSON.stringify(isSubmitting)}</li>
                        <li>status: {JSON.stringify(status)}</li>
                        <li>values: {JSON.stringify(values)}</li>

                    </ul>
                    <button style={{display:'none'}} id='resetBtn' type="reset" onClick={handleReset}>
                        Reset
                    </button>

                    </Form>
                )}

                onSubmit={(val) => this.handleSubmit(val)}
            >
            </Formik>
        );
    }
}
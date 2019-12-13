import React from 'react';

import { Formik, Form } from 'formik';

export default class AccountForm extends React.Component {

    handleSubmit(val, handleReset) {
        this.props.onSubmit(val);
        //submit後 reset form 
        handleReset.resetForm(this.refs.formik.initialValues);
    }

    render() {
        return (
            <Formik
                initialValues={this.props.model}
                validationSchema={this.props.validationSchema}
                ref='formik'
                render={({
                    errors,
                    status,
                    isValid,
                    dirty,
                    touched,
                    isSubmitting,
                    handleReset,
                    handleChange,
                    values
                }) => (
                        <Form>
                            <div className="ui form error">
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
                            </div>
                            {/* <button  type="reset" onClick={handleReset}>
                        Reset
                    </button> */}

                        </Form>
                    )}

                onSubmit={(val, handleReset) => this.handleSubmit(val, handleReset)}
            >
            </Formik>
        );
    }
}
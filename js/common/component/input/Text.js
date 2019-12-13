import React from 'react';
import { connect } from 'react-redux';
import { Field, ErrorMessage } from 'formik';
import { yup } from 'yup';

@connect()
class Text extends React.Component {
    static defaultProps = {
        placeholder: '',
        required: false,
        isEmail: false,
    }

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div>
                <Field type={this.props.type} name={this.props.name} >
                    {({ field }) => (
                        
                        <div className="field">
                            <input type="text"  maxlength={this.props.maxlength} {...field} placeholder={this.props.placeholder} />
                            <small>
                                <ErrorMessage name={this.props.name} component="div" render={(msg) => {
                                    return ( <div className='ui error message'><p>{msg}</p></div>)}} />
                            </small>
                        </div>
                    )}
                </Field>
            </div>
        )

    }
}

export default Text;

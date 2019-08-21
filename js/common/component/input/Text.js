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


    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState) {
    }

    onBlur(e) {

        console.log(e.currentTarget.value)

        if (typeof this.props.onBlur == 'function') {
            this.props.onBlur();
        }
    }
    changeValue(e) {
        console.log(e.currentTarget.value)
        if (typeof this.props.onChange == 'function') {
            this.props.onChange(event);
        }
    }

    render() {
        return (
            <div>
                <Field type={this.props.type} name={this.props.name} >
                    {({ field, form }) => (
                        <div className="form-group col-xs-2">

                            <input type="text" className="form-control" maxlength={this.props.maxlength} {...field} placeholder={this.props.placeholder} />
                            <small className="form-text text-muted">
                                <ErrorMessage name={this.props.name} component="div" render={msg => <div className='errorMsg'>{msg}</div>} />
                            </small>
                        </div>
                    )}
                </Field>
            </div>
        )

    }
}

export default Text;

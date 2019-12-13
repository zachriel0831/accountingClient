import React from 'react';
import { connect } from 'react-redux';
import { Field, ErrorMessage } from 'formik';
import { yup } from 'yup';

@connect()
class Text extends React.Component {
    static defaultProps = {
        placeholder: '',
        required: false,
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
                <Field type={this.props.type} name={this.props.name} autocomplete="new-password" ng-hide="true" >
                    {({ field, form }) => (
                        <div >
                            <input type="password" {...field} placeholder={this.props.placeholder} />
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

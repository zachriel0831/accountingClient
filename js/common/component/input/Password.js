import React from 'react';
import { connect } from 'react-redux';
import { Field, ErrorMessage } from 'formik';

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
                <Field type={this.props.type} name={this.props.name} autocomplete="new-password"  ng-hide="true"/>
                {/* <ErrorMessage name={this.props.name} component="div" />   */}
            </div>
        )

    }
}

export default Text;

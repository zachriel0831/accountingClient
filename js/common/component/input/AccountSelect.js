import React from 'react';
import { connect } from 'react-redux';
import { Field, ErrorMessage } from 'formik';
import { yup } from 'yup';


function Option(props) {

    return <option value={props.value}>{props.label}</option>;
}


@connect()
class AccountSelect extends React.Component {
    static defaultProps = {
        placeholder: '',
        required: false,
        isEmail: false,
    }

    constructor(props) {
        super(props);
        this.state = {
            containers: [],
        }
        this.fullPackage = [];
        this.defaultOption = <Option key='000' value='' label={this.props.defaultOption} />;

        let containers = [];

        let options = this.props.value;

        if (options) {

            containers.push(this.defaultOption)
            options.map((k, v) => {
                let f = <Option key={k.groupKey} value={k.value} label={k.label} />
                containers.push(f);
            })

            this.fullPackage = containers;
        }
        this.state = {
            containers: containers
        }


    }


    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.value != this.props.value) {
            let options = this.props.value;

            if (options) {

                let containers = [];
                containers.push(this.defaultOption)
                options.map((k, v) => {
                    let f = <Option key={k.groupKey} value={k.value} label={k.label} />
                    containers.push(f);
                })

                this.fullPackage = containers;
                this.setState({
                    containers: containers
                })
            }
        }

        if (prevProps.groupKey != this.props.groupKey) {
            let filterContainer = []

            if (this.props.groupKey === '') {
                filterContainer = this.fullPackage
            } else {
                filterContainer = (this.fullPackage).filter(k=>k.key === this.props.groupKey);
            }
            filterContainer.unshift( this.defaultOption )

            this.setState({
                containers: filterContainer,
            })
        }
    }

    onBlur(e) {

        console.log(e.currentTarget.value)

        if (typeof this.props.onBlur == 'function') {
            this.props.onBlur();
        }
    }
    selectChange(e, field, form) {
        console.log(e.currentTarget.value)
        form.setFieldValue(field.name, e.currentTarget.value, true)

        let val = e.currentTarget.value;
        if (typeof this.props.onChange == 'function') {
            this.props.onChange(event, val);
        }
    }

    render() {
        return (
            <div>
                <Field component="select"
                    name={this.props.name}
                >

                    {({ field, form }) => (
                        <div>
                            <select
                                {...field}
                                onChange={(e) => { this.selectChange(e, field, form) }}
                                className="radio-button"
                            >
                                {this.state.containers}
                            </select>
                            <small className="form-text text-muted"><ErrorMessage name={this.props.name} component="div" render={msg => <div className='errorMsg'>{msg}</div>} /></small>
                        </div>
                    )}

                </Field>

            </div>
        )

    }
}

export default AccountSelect;

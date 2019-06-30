import React from 'react';
import { connect } from 'react-redux';
import { Field, ErrorMessage } from 'formik';
import { yup } from 'yup';

// Radio input
const RadioButton = ({
    field: { name, value, onChange, onBlur },
    id,
    label,
    className,
    ...props
  }) => {
    return (
      <div>
        <input
          name={name}
          id={id}
          type="radio"
          value={id} // could be something else for output?
          checked={id === value}
          onChange={onChange}
          onBlur={onBlur}
          className="radio-button"
          {...props}
        />
        <label htmlFor={id}>{label}</label>
      </div>
    );
  };

@connect()
class RadioBtn extends React.Component {
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
                <Field type={this.props.type} name={this.props.name} >
                    {({ field, form }) => (
                        <div>
                            <input
                                {...field}
                                type="radio"
                                onChange={()=>{form.setFieldValue(field.name,this.props.value,true)}}
                                onBlur={(e)=>this.onBlur(e)}
                                className="radio-button"
                            />
                            <label htmlFor={this.props.id}>{this.props.label}</label>
                            <small className="form-text text-muted"><ErrorMessage name={this.props.name} component="div" render={msg => <div className='errorMsg'>{msg}</div>} /></small>
                        </div>
                    )}
                </Field>

            </div>
        )

    }
}

export default RadioBtn;

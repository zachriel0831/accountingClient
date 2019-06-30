import React from 'react';
import { connect } from 'react-redux';
import { Field, ErrorMessage } from 'formik';
import { yup } from 'yup';


function Option(props) {

    return <option value={props.value}>{props.label}</option>;
  }
  
@connect()
class Select extends React.Component {
    static defaultProps = {
        placeholder: '',
        required: false,
        isEmail: false,
    }

    constructor(props) {
        super(props);

        let options = this.props.value;
        let contaniners = [];

        if (options) {

            contaniners.push(<Option key='000' value='' label={this.props.defaultOption} />)
            options.map((k, v) => {

                let f = <Option key={v} value={k} label={k} />
                contaniners.push(f);
            })

        }
        this.state = {
            contaniners:contaniners,
        }
    }


    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState) {

        if(prevProps.value != this.props.value){
            let options = this.props.value;

            if (options) {

                let contaniners = [];
                contaniners.push(<Option key='000' value='' label={this.props.defaultOption} />)
                options.map((k, v) => {
                    let f = <Option key={k.value} value={k.value} label={k.label} />
                    contaniners.push(f);
                })
                this.setState({
                    contaniners:contaniners
                })
            }
        }

    }

    onBlur(e) {

        console.log(e.currentTarget.value)

        if (typeof this.props.onBlur == 'function') {
            this.props.onBlur();
        }
    }
    selectChange(e,field,form) {
        console.log(e.currentTarget.value)
        form.setFieldValue(field.name,e.currentTarget.value,true)
        let val = e.currentTarget.value;
        if (typeof this.props.onChange == 'function') {
            this.props.onChange(e,val);
        }
    }

    render() {
        return (
            <div>
                <Field 
                    name={this.props.name} 
                    handleChange={(e)=>this.handleChange(e)}>

                   {({ field, form }) => (
                        <div>
                            <select
                                {...field}
                                onChange={(e)=>{this.selectChange(e,field,form)}}
                                className="radio-button"
                            >
                                               {this.state.contaniners}
                            </select>
                            <small className="form-text text-muted"><ErrorMessage name={this.props.name} component="div" render={msg => <div className='errorMsg'>{msg}</div>} /></small>
                        </div>
                    )}

                </Field>

            </div>
        )

    }
}

export default Select;

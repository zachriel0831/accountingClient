import React from 'react';
import { Checkbox } from 'semantic-ui-react';

class PureCheckBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: this.props.checked ? true : false,
            disabled: this.props.disabled
            // disableState: this.props.checked ? true : false,

        }
    }

    clickValue(e) {
        this.setState({
            active: !this.state.active
        });

        let val = this.props.value;
        
        if (typeof this.props.onClick === 'function') {
            this.props.onClick(e, val, !this.state.active);
        }
    }

    render() {
        return (
            <div className={`ui ${this.props.disabled ? 'disabled' : ''} checkbox`}>
                <input type="checkbox"
                    checked={this.state.active}
                    disabled={this.props.disabled}
                    name={this.props.name}
                    value={this.props.value}
                    onClick={(e) => this.clickValue(e)} />

                <label for={this.props.id}>{this.props.label}</label>
            </div>
        )
    }


    defaultProps = {
        name: '',
        disabled: false,
        label: '',
        value: '',
        checked:false,
    }
}

export default PureCheckBox;
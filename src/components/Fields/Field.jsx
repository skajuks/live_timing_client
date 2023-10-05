import React from 'react'

class Field extends React.Component {
    getNamePostfix() {
        return (this.props.postfix) ? this.props.name + '_' + this.props.postfix : this.props.name + '_edit';
    }
    getWrapClassName() {
        return "input_field_wrap_" + this.getNamePostfix();
    }
    isDisabled() {
        let disabled = false;
        if (this.props.status && this.props.status === 'disabled') {
            disabled = true;
        }
        return disabled;
    }
    isHidden() {
        let hidden = false;
        if (this.props.status && this.props.status === 'hidden') {
            hidden = true;
        }
        return hidden;
    }
    onChange(event) {
        if (this.props['onChange'])
        this.props.onChange({name: this.props.name, value: event.target.value})
    }
    showError() {
        if(this.props.error && this.props.error['message']) {
            return (<span className="error_tag">{this.props.error.message}</span>)
        } else return null;
    }
    showLabel() {
        if (this.props.label) {
            return (
                <label htmlFor={this.getNamePostfix()}>{this.props.label}</label>
            )
        } else {
            return null;
        }
    }
    showInput() {
        return null;
    }
    render() {
        if (this.isHidden()) {
            return null
        } else {
            return (
                <div className={this.getWrapClassName()}>
                    {this.showLabel()}
                    {this.showInput()}
                    {this.showError()}
                </div>
            )
        }
    }
}

export default Field;
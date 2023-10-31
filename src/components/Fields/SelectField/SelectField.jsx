import React from 'react'
import Select from 'react-select';
import Field from '../Field';

class SelectField extends Field {

    getWrapClassName() {
        return "select_field_wrapper_";
    }
    callback = (value) => {
        if (this.props.onChange) {
            console.log(value);
            this.props.onChange(value.value);
        }
    }

    showInput() {
        let value = (this.props.value !== '') ? this.props.value : '';
        let customClass = this.props.customClass || "__board_table_filter_item"
        let isMulti = this.props.isMulti ? true : false;
        let options = (!Array.isArray(this.props.options)) ? [] : this.props.options;
        let clearable = (this.props.allowEmpty) ? true : false;
        let select_id = {'id':this.props.name};
        let name_postfix = (this.props.postfix) ? this.props.name + '_' + this.props.postfix : this.props.name + '_edit';
        return (
            <Select
                name={name_postfix}
                className={customClass}
                clearable={clearable}
                inputProps={select_id}
                value={value}
                options={options}
                isMulti={isMulti}
                disabled={this.isDisabled()}
                onChange={this.callback}
                theme={(theme) => ({
                    ...theme,
                    colors: {
                        ...theme.colors,
                        primary25: "black",
                        primary: "#131417",
                        neutral0: "black",
                        neutral15: "#131417",
                        neutral10: "#ffcf55",
                        neutral20: "#1a1b1f"
                    }
                })}

                />
        );
    }
}

export default SelectField;
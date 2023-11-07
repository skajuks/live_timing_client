import React from "react";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { OptionsTransformer } from "../helpers/OptionsTransformer";

export default class ResizableTableFilter extends React.Component
    <{data: any, fields: any, callback: Function, show: boolean, mediaQuery: any},
    {selectedClasses: any, selectedColumns: any, availableData: any}> {

    // Variables
    fields: any;
    data: any;
    optionsClass: any;
    optionsFields: any;
    allOptionsFields: any;
    animated: any;
    enabledFieldsInitialized: boolean = false;

    constructor(props: any) {
        super(props);
        this.state = {
            selectedClasses: [],
            selectedColumns: [],
            availableData: {},
        }
        this.fields = props.fields;
        this.data = props.data;
        this.animated = makeAnimated();
    }
    componentDidUpdate(prevProps: Readonly<{ data: any; fields: any; }>): void {
        if (this.props.data !== prevProps.data || this.props.fields !== prevProps.fields) {
            this.fields = this.props.fields;
            this.data = this.props.data;
            if (!this.enabledFieldsInitialized) {
                this.initializeSelectedClasses();
                this.enabledFieldsInitialized = true;
            }
            this.initData(this.data);
        }
    }
    initializeSelectedClasses() {
        this.fields.enabledClasses = this.data?.race_info?.availableClasses || [];
    }
    onFilterChange(filter: string, data: any) {
        if (!data) { return; }
        switch(filter) {
            case "class": {
                const classes = this.state.selectedClasses;
                const valuesToRemove = new Set(data.map((obj: any) => obj.value));
                const newClasses = classes.filter((val: any) => valuesToRemove.has(val));
                this.setState({ selectedClasses: newClasses });
                this.props.callback({classes: newClasses, fields: this.state.selectedColumns});
                break;
            }
            case "fields": {
                const fields = this.state.selectedColumns;
                const filtered: any = {};
                if (data.length > Object.keys(fields).length) {
                    data.map((obj: any) => {
                        filtered[obj.value] = obj.label
                    });
                } else {
                    const valuesToRemove = new Set(data.map((obj: any) => obj.value));
                    for (const key in fields) {
                        if (valuesToRemove.has(key)) {
                            filtered[key] = fields[key];
                        }
                    }
                }
                this.setState({ selectedColumns: filtered });
                this.props.callback({classes: this.state.selectedClasses, fields: filtered});
                break;
            }
        }
    }
    initData(data: any): void {
        if (!data) { return; }
        const allClasses: any[] = [];
        const allFields: any[] = [];
        const parsedClasses: any = {};
        const parsedFields: any = {};
        let enabledFields: any = {};
        data.competitor?.forEach((item: any) => {
            for (const [key, value] of Object.entries(item)) {
                if (this.fields.banned.includes(key)) { continue; }
                if (key === "class" && !allClasses.includes(value)) {
                    allClasses.push(value);
                }
                if (!allFields.includes(key)) {
                    allFields.push(key);
                }
            }
        });
        allClasses.forEach((item: any) => {
            parsedClasses[item] = item?.toUpperCase();
        });
        allFields.forEach((item: any) => {
            parsedFields[item] = this.fields.config[item]?.label || item
            if (typeof(this.fields.enabled) === "object") {
                if (Array.isArray(this.fields.enabled)) {
                    if (this.fields.enabled.includes(item)) {
                        enabledFields[item] = this.fields.config[item]?.label || item
                    }
                } else {
                    enabledFields = this.fields.enabled;
                }
            }
        });
        this.setState({
            availableData: {
                classes: parsedClasses,
                fields: parsedFields
            },
            selectedClasses: allClasses,
            selectedColumns: enabledFields
        });
        this.optionsClass = new OptionsTransformer(parsedClasses).get();
        this.allOptionsFields = new OptionsTransformer(parsedFields).get();
        this.optionsFields = new OptionsTransformer(enabledFields).get();
    }

    render() {
        return (
            <div
                className={`${this.props.mediaQuery.mobile ?
                    "mobile_resizable-table-filter-row" : "resizable-table-filter-row"
                } ${this.props.show ? this.props.mediaQuery.mobile ? "mobile_filter-height" : "filter-height-100" : ""}`}
                style={{
                    overflow: this.props.show ? "visible" : "hidden",
                    height: this.props.show ? this.props.mediaQuery.mobile ? "fit-content": "100px" : "0"
                }}
            >
                {
                    this.optionsClass &&
                    <div
                        className={`${this.props.mediaQuery.mobile ?
                            "mobile_resizable-table-filter-selector" : "resizable-table-filter-selector"}`}
                    >
                        <p>Selected Classes</p>
                        <Select
                            name="classes"
                            className={`${this.props.mediaQuery.mobile ? "mobile_resizable-select" : "resizable-table-filter-select"}`}
                            closeMenuOnSelect={false}
                            defaultValue={this.optionsClass}
                            options={this.optionsClass}
                            onChange={(data: any) => { this.onFilterChange("class", data)}}
                            components={this.animated}
                            placeholder={"Select an available class from dropdown"}
                            isMulti={true}
                            theme={(theme) => ({
                                ...theme,
                                colors: {
                                    ...theme.colors,
                                    primary25: "#0f101a",
                                    primary: "#131417",
                                    neutral0: "#0f101a",
                                    neutral15: "#131417",
                                    neutral10: "#1d5ebf",
                                    neutral20: "#282b4d",
                                    neutral80: "azure",
                                }
                            })}
                        />
                    </div>
                }
                {
                    this.optionsFields &&
                    <div
                        className={`${this.props.mediaQuery.mobile ?
                            "mobile_resizable-table-filter-selector" : "resizable-table-filter-selector"}`}
                    >
                        <p>Selected Fields</p>
                        <Select
                            name="fields"
                            defaultValue={this.optionsFields}
                            className={`${this.props.mediaQuery.mobile ? "mobile_resizable-select" : "resizable-table-filter-select"}`}
                            options={this.allOptionsFields}
                            components={this.animated}
                            isMulti={true}
                            onChange={(data: any) => { this.onFilterChange("fields", data) }}
                            closeMenuOnSelect={false}
                            theme={(theme) => ({
                                ...theme,
                                colors: {
                                    ...theme.colors,
                                    primary25: "#0f101a",
                                    primary: "#131417",
                                    neutral0: "#0f101a",
                                    neutral15: "#131417",
                                    neutral10: "#3d22d4",
                                    neutral20: "#282b4d",
                                    neutral80: "azure",
                                }
                            })}
                        />
                    </div>
                }
            </div>
        );
    }
};
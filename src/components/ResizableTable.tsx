import React from "react";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

export default class ResizableTable extends React.Component
    <{data: any, fields: any, fontSize: number, colors: any[], mediaQuery: any},
    {colwidths: any, groupedData: any, groupedDataKeys: string[], currentChildWidth: number}
    > {

    // Variables
    fields: any;
    data: any;
    defaultColWidth: number = 120;
    maxTableWidth: number = 1600;
    enabledFieldsInitialized: boolean = false;

    constructor(props: any) {
        super(props);
        this.state = {
            colwidths: {},
            groupedData: {},
            groupedDataKeys: [],
            currentChildWidth: 0
        };
        this.fields = props.fields;
        this.data = props.data;
    }
    componentDidUpdate(prevProps: Readonly<{ data: any; fields: any; }>): void {
        if (this.props.data !== prevProps.data || this.props.fields !== prevProps.fields) {
            console.log("resizeTableUpdate() called");
            this.fields = this.props.fields;
            this.data = this.props.data;
            if (!this.enabledFieldsInitialized) {
                this.initializeSelectedClasses();
                this.enabledFieldsInitialized = true;
            }
            this.importData(this.props.data);
        }
    }
    initializeSelectedClasses() {
        this.fields.enabledClasses = this.data?.race_info?.availableClasses || [];
    }
    importData(data: any): void {
        const columnWidthData: any = {};
        const groupedData: any = {};
        data?.competitor?.forEach((item: any) => {
            for (const [key, value] of Object.entries(item)) {
                // skips
                if (Array.isArray(this.fields.enabled)) {
                    if (!this.fields.enabled.includes(key)) {
                            continue;
                        }
                } else {
                    if (typeof this.fields.enabled === 'object') {
                        if (!Object.keys(this.fields.enabled).includes(key)) { continue; }
                    }
                }
                if (this.fields.banned.includes(key)) { continue; }

                if (groupedData.hasOwnProperty(key)) {
                    if (item.class && this.fields.enabledClasses.includes(item.class)) {
                        groupedData[key].push(value);
                    }
                } else {
                    groupedData[key] = [];
                    if (item.class && this.fields.enabledClasses.includes(item.class)) {
                        groupedData[key].push(value);
                    }
                    columnWidthData[key] = this.fields.config[key]?.defaultWidth || this.defaultColWidth;
                }
            };
        });
        const sorted = [...Object.keys(groupedData)].sort((a, b) => {
            const aIndex = this.fields.order.indexOf(a);
            const bIndex = this.fields.order.indexOf(b);
            return aIndex - bIndex;
        })
        const sum: number = Object.values(columnWidthData).reduce<number>((partial: any, a) => partial + a, 0 as number);
        this.setState({
            groupedData: groupedData,
            colwidths: columnWidthData,
            groupedDataKeys: sorted,
            currentChildWidth: sum
        });
    }
    parseHeader(item: string) {
        if (this.state.groupedDataKeys.includes(item)) {
            const label = this.fields.config[item]?.label;
            return ( <p>{label || item}</p> );
        }
        return ( <p>{item}</p> );
    }
    parseItem(item: string, grouped: string) {
        if (Object.keys(this.fields.config).includes(item)) {
            const element = this.fields.config[item]?.customElement;
            if (typeof element === 'string' || typeof element === 'function') {
                const props = {name: item, data: grouped, fastest: this.data.race_info?.fastest_lap };
                return React.createElement(element, props, grouped);
            }
        }
        const fontSize = this.fields.config[item]?.fontSize;
        return ( <p style={{fontSize: fontSize ? `${fontSize * this.props.fontSize}px` : `${20 * this.props.fontSize}px`}}>{grouped}</p> );
    }
    handleResize(colkey: any, width: number) {
        const sum = this.state.currentChildWidth;
        this.setState({
            colwidths: {...this.state.colwidths, [colkey]: width},
            currentChildWidth: Number(sum - this.state.colwidths[colkey] + width)
        });
    }
    print(what: any) {
        console.log(what);
    }
    render(): any {
        if (!this.props.data) {
            return (
                <div className={
                    this.props.mediaQuery.mobile ? "mobile__historyRace-table-inside-loader" : "app__historyRace-table-inside-loader"
                }>
                    <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
                    <p>Loading competitor data...</p>
                </div>
            );
        }

        return (
        <div
            className="app__historyRace-table-inside"
        >
                <div className="resizable_wrapper">
                {
                    ((!this.props.mediaQuery.portrait && this.props.mediaQuery.mobile) ||
                    (!this.props.mediaQuery.mobile))
                    ?
                    this.state.groupedDataKeys.map((item: any, index: number) =>
                        <ResizableBox
                            className="resizeable_table_head"
                            key={`resizeable_item_head${index}`}
                            width={this.state.colwidths[item]}
                            height={30}
                            axis="x"
                            minConstraints={[80, 30]}
                            maxConstraints={[300, 30]}
                            onResize={(e, {size}) => {
                                this.handleResize(item, size.width);
                            }}
                        >
                            {this.parseHeader(item)}
                        </ResizableBox>
                    )
                    :
                    Object.keys(this.fields.verticalModeDefaults).map((item: any, index: number) =>
                        <div
                            className="non-resizable_table_head"
                            key={`non-resizeable_item_head${index}`}
                            style={{width: `${this.fields.verticalModeDefaults[item].width}%`}}
                        >
                            {this.parseHeader(this.fields.verticalModeDefaults[item]?.shortname || item)}
                        </div>
                    )
                }
                </div>
            <div
                className="resizeable_content-wrapper"
                style={{display: this.props.mediaQuery.mobile && this.props.mediaQuery.portrait ? "block" : "flex"}}
            >
                {
                this.props.mediaQuery.mobile && this.props.mediaQuery.portrait ?
                this.data?.competitor?.map((item: any, index: number) =>
                    <div
                        className="mobile__resiazble_content"
                        key={`resizable_item_content${index}`}
                    >
                        {
                            Object.keys(this.fields.verticalModeDefaults).map((field: any, index2: number) =>
                                <div
                                    className="mobile__resiazble_item"
                                    key={`resizable_mobile_item_content${index2}$_${field}`}
                                    style={{
                                        width: `${this.fields.verticalModeDefaults[field].width}%`,
                                        background: `${index % 2 === 0 ? this.props.colors[0] : this.props.colors[1]}`,
                                        justifyContent: this.fields.verticalModeDefaults[field].justifyStart ?
                                            "flex-start" : "center"
                                    }}
                                >
                                {
                                    this.fields.verticalModeDefaults[field].customElement ?
                                    this.fields.verticalModeDefaults[field].customElement({data: item[field]})
                                    :
                                    <p
                                        key={`${item[field]}_${index}`}
                                        style={{
                                            marginLeft: this.fields.verticalModeDefaults[field].justifyStart ?
                                                "10px": "0px"
                                        }}
                                    >{item[field]}
                                    </p>
                                }
                                </div>
                            )
                        }
                    </div>
                ) :
                // finish this for simpified results :)))
                this.state.groupedDataKeys.map((item: any, index: number) =>
                    <div
                        className="resiazble_content"
                        key={`resizeable_item_content${index}`}
                        style={{width: `100%`}}
                    >
                        {this.state.groupedData[item].map((grouped_item: any, index2: number) =>
                            <div
                            className="resizable_item"
                                key={`grouped_item_${item}${index2}`}
                                style={{
                                        width: `${this.state.colwidths[item]}px`,
                                        background: `${index2 % 2 === 0 ? this.props.colors[0] : this.props.colors[1]}`
                                    }}
                            >
                                { this.parseItem(item, grouped_item) }
                            </div>
                        )}
                    </div>
                )
                }
            </div>
        </div>
        );
    }
};
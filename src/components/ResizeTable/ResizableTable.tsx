import React from "react";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

type MouseEvent = React.MouseEvent<HTMLDivElement>;

export default class ResizableTable extends React.Component
    <{data: any, fields: any, fontSize: number, colors: any[], mediaQuery: any},
    {
        colwidths: any,
        groupedData: any,
        groupedDataKeys: string[],
        currentChildWidth: number,
        dragging: boolean,
        dragIndex: number,
        dragItem: string,
        originalDragItem: string
    }
    > {

    // Variables
    fields: any;
    ref: any;
    data: any;
    defaultColWidth: number = 120;
    maxTableWidth: number = 1600;
    enabledFieldsInitialized: boolean = false;
    loadedPreviousFieldWidths: boolean = false;
    colWidthsFirstInit: boolean = true;
    defaultTableHeight: number = 570;
    settings:any = {
        currentColumnWidth: {}
    };

    constructor(props: any) {
        super(props);
        this.state = {
            colwidths: {},
            groupedData: {},
            groupedDataKeys: [],
            currentChildWidth: 0,
            dragging: false,
            dragIndex: -1,
            dragItem: "",
            originalDragItem: "",
        };
        this.fields = props.fields;
        this.data = props.data;
        this.ref = React.createRef();
    };

    swapStrings(arr: string[], str1: string, str2: string) {
        const index1 = arr.indexOf(str1);
        const index2 = arr.indexOf(str2);

        if (index1 !== -1 && index2 !== -1) {
            [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
        } else {
            console.log("One or both strings not found in the array.");
        }
        return arr;
    };

    handleDragStartEnd = (index: number, item: string) => {
        if (this.state.dragging) {
            this.setState({ dragging: false, dragIndex: -1 });
        } else {
            this.setState({ dragging: true, dragIndex: index, dragItem: item, originalDragItem: item});
        }
    };

    handleDrag = (item: string) => {
        if (this.state.dragging) {
            if (item !== this.state.dragItem) {
                const newIndex = this.state.groupedDataKeys.findIndex((x: any) => x === item);
                this.setState({ dragItem: item, dragIndex: newIndex});
                this.fields.order =  this.swapStrings([...this.fields.order], this.state.originalDragItem, item);
                localStorage.setItem("colorder", JSON.stringify(this.fields.order));
                this.importData(this.data);
            }
        }
    };

    componentDidUpdate(prevProps: Readonly<{ data: any; fields: any; }>): void {
        if (this.props.data !== prevProps.data || this.props.fields !== prevProps.fields) {
            this.fields = this.props.fields;
            this.fields.order = prevProps.fields.order;
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
        if (!this.loadedPreviousFieldWidths) {
            this.settings.currentColumnWidth = JSON.parse(localStorage.getItem("colwidths")!) || {};
            this.fields.order = JSON.parse(localStorage.getItem("colorder")!) || this.fields.order;
            this.loadedPreviousFieldWidths = true;
        }

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
                    if (!this.settings.currentColumnWidth?.[key]) {
                        this.settings.currentColumnWidth[key] = this.fields.config[key]?.defaultWidth || this.defaultColWidth;
                    }
                    columnWidthData[key] = this.settings.currentColumnWidth[key] || this.fields.config[key]?.defaultWidth || this.defaultColWidth;
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
            groupedDataKeys: sorted,
            colwidths: columnWidthData,
            currentChildWidth: sum
        });
        if (this.colWidthsFirstInit) {
            // const sum: number = Object.values(columnWidthData).reduce<number>((partial: any, a) => partial + a, 0 as number);
            // this.setState({
            //     colwidths: columnWidthData,
            //     currentChildWidth: sum
            // });
            // this.colWidthsFirstInit = false;
        }
    }
    parseHeader(item: string, index: number) {
        let label = item;
        if (this.state.groupedDataKeys.includes(item)) {
            label = this.fields.config[item]?.label;
        }
        return ( <p
            onClick={(event: any) => this.handleDragStartEnd(index, item)}
            onMouseMove={(event: any) => this.handleDrag(item)}
            >{label}</p> );
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
        this.settings.currentColumnWidth[colkey] = width;
        localStorage.setItem("colwidths", JSON.stringify(this.settings.currentColumnWidth));
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
            ref={this.ref}
        >
                <div className="resizable_wrapper">
                {
                    ((!this.props.mediaQuery.portrait && this.props.mediaQuery.mobile) ||
                    (!this.props.mediaQuery.mobile))
                    ?
                    this.state.groupedDataKeys.map((item: any, index: number) =>
                        <>
                        {
                            index === this.state.dragIndex
                            ?
                                <div
                                    className="resizable_ghost_block"
                                    style={{width: this.state.colwidths[item]}}
                                    onClick={(event: any) => this.handleDragStartEnd(index, item)}
                                />
                            :
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
                                {this.parseHeader(item, index)}
                            </ResizableBox>
                        }
                        </>
                    )
                    :
                    Object.keys(this.fields.verticalModeDefaults).map((item: any, index: number) =>
                        <div
                            className="non-resizable_table_head"
                            key={`non-resizeable_item_head${index}`}
                            style={{width: `${this.fields.verticalModeDefaults[item].width}%`}}
                        >
                            {this.parseHeader(this.fields.verticalModeDefaults[item]?.shortname || item, index)}
                        </div>
                    )
                }
                </div>
            <div
                className="resizeable_content-wrapper"

                id="resizable_content-wrapper-id"
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
                <>
                    {
                        index !== this.state.dragIndex
                        ?
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
                        :
                        <div
                            className="resizable-ghost-content"
                            style={{ width: "100%" }}
                        >
                            <div className="resizable-ghost-content-inner"
                                style={{ width: `${this.state.colwidths[item]}px` }}
                            />
                        </div>
                    }
                </>
                )
                }
            </div>
        </div>
        );
    }
};
import { useParams } from "react-router-dom";
import "./raceHistoryRace.scss";
import { useEffect, useState } from "react";
import { parseDate } from "../../../../../helpers/Parsers";
import { AiOutlineFieldTime } from "react-icons/ai";
import { BsTrophyFill } from "react-icons/bs";
import { BiFontSize } from "react-icons/bi";
import { IoColorPalette, IoFilterOutline } from "react-icons/io5";
import { RiTimerFlashFill } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import React from "react";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { OptionsTransformer } from '../../../../../helpers/OptionsTransformer';

const ResizableTableSurnameComponent = (props: any) => {
    return (
        <span className="resized_position_surname">{props?.data}</span>
    );
};
const ResizableTableFastestLapComponent = (props: any) => {
    const isFastest = props.data === props.fastest?.best_lap_time;
    return (
        <p style={{
            color: isFastest ? "#bc29cc" : "azure",
            fontWeight: isFastest ? "800" : "100"
        }}>{props.data}</p>
    );
};
const ResizableTablePosComponent = (props: any) => {
    return (
        <div className="resized_position_wrapper">
            <p>{props.data}</p>
        </div>
    );
};
const ResizableTableTimeTakenComponent = (props: any) => {
    return (
        <p style={{
                color: props.data === "DNF" ? "#e01220" : "#18d968",
                fontWeight: props.data === "DNF" ? "800" : "300"
            }}>{props.data}</p>
    );
};
const ResizableTableImgComponent = (props: any) => {
    if (!props.data) { return; }
        return (
            <img src={`https://flagcdn.com/${props.data?.toLowerCase()}.svg`} alt={props.name}/>
        );
};


class RaceHistoryRaceWinners extends React.Component <{data: any}, {raceWinner: any, fastestLap: any, raceType: string}> {
    constructor(props: any) {
        super(props);
        this.state = {
            raceWinner: {},
            fastestLap: {},
            raceType: "",
        }
    }
    componentDidUpdate(prevProps: Readonly<{ data: any }>): void {
        if (this.props.data !== prevProps.data) {
            this.parseData(this.props.data);
        }
    }
    parseData(data: any): void {
        if (!data) { return; }
        this.setState({
                raceWinner: data.race_data.winner,
                fastestLap: data.race_data.fastest_lap,
                raceType: data.race_data.race_type
            });
    }
    render() {
        if (!this.state.raceWinner) { return (<></>); }
        return (
            <div className="app__historyRace-data-race-winners">
            {
                <div className="app__historyRace-data-winner">
                    <BsTrophyFill color="#ffe608" size={"30px"}/>
                    <p>#{this.state.raceWinner?.nr}</p>
                    <h4>{`${this.state.raceWinner?.firstname?.charAt(0)}. ${this.state.raceWinner?.lastname}`}</h4>
                    <p>{this.state.raceWinner?.class}</p>
                </div>
            }
            {
                this.state.raceType === "Race" &&
                <div className="app__historyRace-data-fastest-lap">
                    <RiTimerFlashFill size={"32px"}/>
                    <p>#{this.state.fastestLap?.nr}</p>
                    <h4>{`${this.state.fastestLap?.firstname?.charAt(0)}. ${this.state.fastestLap?.lastname}`}</h4>
                    <span>{this.state.fastestLap?.best_lap_time}</span>
                </div>
            }
            </div>
        );
    }
}

class ResizableTableFilter extends React.Component
    <{data: any, fields: any, callback: Function, show: boolean},
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
            parsedClasses[item] = item.toUpperCase();
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
                className={`resizable-table-filter-row ${this.props.show ? "filter-height-100" : ""}`}
                style={{overflow: this.props.show ? "visible" : "hidden"}}
            >
                {
                    this.optionsClass &&
                    <div className="resizable-table-filter-selector">
                        <p>Selected Classes</p>
                        <Select
                            name="classes"
                            className="resizable-table-filter-select"
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
                                    primary25: "black",
                                    primary: "#131417",
                                    neutral0: "black",
                                    neutral15: "#131417",
                                    neutral10: "#9e153e",
                                    neutral20: "#1a1b1f",
                                    neutral80: "azure",
                                }
                            })}
                        />
                    </div>
                }
                {
                    this.optionsFields &&
                    <div className="resizable-table-filter-selector">
                        <p>Selected Fields</p>
                        <Select
                            name="fields"
                            defaultValue={this.optionsFields}
                            className="resizable-table-filter-select"
                            options={this.allOptionsFields}
                            components={this.animated}
                            isMulti={true}
                            onChange={(data: any) => { this.onFilterChange("fields", data) }}
                            closeMenuOnSelect={false}
                            theme={(theme) => ({
                                ...theme,
                                colors: {
                                    ...theme.colors,
                                    primary25: "black",
                                    primary: "#131417",
                                    neutral0: "black",
                                    neutral15: "#131417",
                                    neutral10: "#3d22d4",
                                    neutral20: "#1a1b1f",
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

class ResizableTable extends React.Component
    <{data: any, fields: any, fontSize: number, colors: any[]},
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
                    groupedData[key].push(value);
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
    render(): any {
        if (!this.props.data) {
            return (
                <div className="app__historyRace-table-inside">
                    <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
                    <p>Loading competitor data...</p>
                </div>
            );
        }

        return (
        <div
            className="app__historyRace-table-inside"
            style={{
                    margin: this.state.currentChildWidth > this.maxTableWidth ? "0" : "0 auto"
                }}
        >
                <div className="resizable_wrapper">
                {
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
                }
                </div>
            <div className="resizeable_content-wrapper">
                {this.state.groupedDataKeys.map((item: any, index: number) =>
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
                )}
            </div>
        </div>
        );
    }
};

const fields = {
    banned: ["id", "race_id", "position_by_time", "position_by_lap", "diff_by_time", "diff_by_lap", "gap_by_time", "gap_by_lap"],
    enabled: ["position", "nr", "state", "firstname", "lastname", "class", "best_lap_time", "finished_time", "best_lap", "sponsor"],
    enabledClasses: [],
    defaultFontSize: 20,
    order: ["position", "nr", "state", "state2", "firstname", "lastname", "class", "sponsor", "make", "best_lap", "best_lap_time", "finished_time", "lap", "diff", "gap"],
    config: {
        position: {
            label: "Position",
            customElement: ResizableTablePosComponent,
            defaultWidth: 90
        },
        nr: { label: "Start nr", defaultWidth: 90 },
        state: {
            label: "Country 1",
            customElement: ResizableTableImgComponent,
            isImageElement: true,
            defaultWidth: 90
        },
        state2: {
            label: "Country 2",
            customElement: ResizableTableImgComponent,
            defaultWidth: 90
        },
        firstname: { label: "Name", defaultWidth: 220 },
        lastname: {
            label: "Surname",
            customElement: ResizableTableSurnameComponent,
            defaultWidth: 220
        },
        sponsor: { label: "Sponsor", defaultWidth: 150 },
        best_lap_time: {
            label: "Fastest lap time",
            defaultWidth: 150,
            customElement: ResizableTableFastestLapComponent
        },
        best_lap: {
            label: "Fastest lap",
            defaultWidth: 120,
        },
        finished_time: {
            label: "Time taken",
            defaultWidth: 150,
            customElement: ResizableTableTimeTakenComponent},
        lap: { label: "Laps" },
        diff: { label: "Diff" },
        gap: { label: "Gap" },
        class: { label: "Class"},
        make: { label: "Make"}
    }
};

const fontSizeOptions: any[] = [
    {value: 0.7, label: "0.7x"},
    {value: 0.8, label: "0.8x"},
    {value: 0.9, label: "0.9x"},
    {value: 1, label: "1.0x"},
    {value: 1.1, label: "1.1x"},
    {value: 1.2, label: "1.2x"},
    {value: 1.3, label: "1.3x"},
    {value: 1.4, label: "1.4x"},
    {value: 1.5, label: "1.5x"},
];

export const RaceHistoryRace = () => {

    const {date, track_name, eventId} = useParams();
    const bg = localStorage.getItem("background");
    const [raceData, setRaceData] = useState<any>(null);
    const [fieldsData, setFieldData] = useState<any>(fields);
    const [fontSize, setFontSize] = useState<number>(fontSizeOptions[0].value);
    const [selectedColors, setSelectedColors] = useState<any>(["#1f2126", "#131315"]);
    const [showFilters, setShowFilters] = useState<boolean>(false);

    const getData = async () => {
        const response = await fetch(`http://localhost:3015/api/getRaceData?track_name=${track_name}&id=${eventId}&date=${date}`);
        const data = await response.json();
        setRaceData(data);
    };
    const getFilterData = (data: any) => {
        setFieldData({...fieldsData, enabled: data.fields, enabledClasses: data.classes});
    };

    useEffect(() => {
        if (!date || !track_name || !eventId) { return; }
        getData();
    }, []);

    return (
        <div
            className="app__historyRace-main"
            style={{
                backgroundImage: bg ? `url('/svg/${bg}.svg')` : "url('/svg/Squares.svg')",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
            }}
        >
            <div className="app__historyRace-table-wrapper">
                <div className="app__historyRace-settings">
                    <div className="app__historyRace-settings-selector">
                        <BiFontSize size={"25px"} color="azure"/>
                        <Select
                            name="fontSize"
                            defaultValue={fontSizeOptions[2]}
                            className="resizable-table-filter-select"
                            options={fontSizeOptions}
                            onChange={(data: any) => { setFontSize(data.value) }}
                            theme={(theme) => ({
                                ...theme,
                                colors: {
                                    ...theme.colors,
                                    primary25: "#121212",
                                    primary75: "azure",
                                    primary: "#3d22d4",
                                    neutral0: "#0f1012",
                                    neutral5: "azure",
                                    neutral10: "azure",
                                    neutral15: "#3d22d4",
                                    neutral20: "#202126",
                                    neutral80: "azure",
                                }
                            })}
                        />
                    </div>
                    <div className="app__historyRace-settings-selector">
                        <IoColorPalette size={"25px"} color="azure"/>
                        <input type="color" id="i65" defaultValue={selectedColors[0]} onChange={(e) => {setSelectedColors([e.target.value ,selectedColors[1]])}}/>
                        <input type="color" id="i64" defaultValue={selectedColors[1]} onChange={(e) => {setSelectedColors([selectedColors[0], e.target.value])}}/>
                    </div>
                </div>
                <div className="app__historyRace-data">
                    <div className="app__historyRace-data-top">
                        <div className="app__historyRace-data-top-event-data">
                            <span>{raceData?.race_data?.name}</span>
                            <p>{raceData?.race_data?.track_name} {parseDate(raceData?.race_data?.date)}</p>
                        </div>
                        <div className="app__historyRace-data-top-track-data">
                            <p><AiOutlineFieldTime/>{raceData?.race_data?.race_time}</p>
                            <span>Track length: {raceData?.race_data?.track_length} km</span>
                        </div>
                    </div>
                    <div className="app__historyRace-data-bottom">
                        <RaceHistoryRaceWinners data={raceData} />
                        <div className="app__historyRace-data-bottom-filter">
                            <div className="app__historyRace-data-bottom-settings-toggle">
                                <IoMdSettings size={"90%"}/>
                            </div>
                            <div className="app__historyRace-data-bottom-filter-toggle">
                                <IoFilterOutline size={"90%"} onClick={(e) => { setShowFilters(!showFilters) }} />
                            </div>
                            {
                                <ResizableTableFilter data={{
                                    competitor: raceData?.competitor_data,
                                    race_info: raceData?.race_data
                                    }}
                                fields={fieldsData}
                                callback={getFilterData}
                                show={showFilters}
                                />
                            }
                        </div>
                    </div>
                </div>
                <div
                    className="app__historyRace-table"
                >
                    <ResizableTable data={{
                                        competitor: raceData?.competitor_data,
                                        race_info: raceData?.race_data
                                        }}
                                        fields={fieldsData}
                                        fontSize={fontSize}
                                        colors={selectedColors}
                    />
                </div>
            </div>
            <div className="app__historyGroups_pageChange"/>
        </div>
    );
};

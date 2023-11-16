import { useParams } from "react-router-dom";
import "./raceHistoryRace.scss";
import { useEffect, useState } from "react";
import { parseDate } from "../../../../../helpers/Parsers";
import { AiOutlineFieldTime, AiOutlineClose } from "react-icons/ai";
import { BiFontSize } from "react-icons/bi";
import { IoColorPalette, IoFilterOutline } from "react-icons/io5";
import { FcRotateToLandscape, FcRotateToPortrait } from "react-icons/fc";
import { IoMdSettings } from "react-icons/io";
import "react-resizable/css/styles.css";
import { io } from "socket.io-client";
import Select from 'react-select';
import { useMediaQuery } from 'react-responsive'
import { getBackendServerAddr } from "../../../mainPage";

// For ResizeTable
import ResizableTable from "../../../../../components/ResizeTable/ResizableTable";
import ResizableTableFilter from "../../../../../components/ResizeTable/ResizableFilter";
import RaceHistoryRaceWinners from "../../../../../components/RaceHistoryRaceWinners";

const ResizableTableSurnameComponent = (props: any) => {
    return (
        <span className="resized_position_surname">{props?.data}</span>
    );
};
const ResizableTableSurnameMobileComponent = (props: any) => {
    return (
        <span className="resized_position_surname_mobile">{props?.data}</span>
    );
};
const ResizableTableFastestLapComponent = (props: any) => {
    const isFastest = props.data === props.fastest?.best_lap_time;
    return (
        <p style={{
            color: isFastest ? "#c44df0" : "#51f6ff",
            fontWeight: isFastest ? "800" : "100",
            marginLeft: "5px"
        }}>{props.data}</p>
    );
};
const ResizableTablePosMobileComponent = (props: any) => {
    return (
        <div className="resized_position_wrapper_mobile">
            <p>{props.data}</p>
        </div>
    );
};
const ResizableTablePosComponent = (props: any) => {
    return (
        <div className="resized_position_wrapper_mobile">
            <p>{props.data}</p>
        </div>
    );
};
const ResizableTableTimeTakenComponent = (props: any) => {
    return (
        <p style={{
                color: props.data === "DNF" ? "#f03a4c" : "#3ff289",
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

const fields = {
    banned: ["id", "race_id", "position_by_time", "position_by_lap", "diff_by_time", "diff_by_lap", "gap_by_time", "gap_by_lap"],
    enabled: ["position", "nr", "state", "firstname", "lastname", "class", "best_lap_time", "finished_time", "best_lap", "sponsor"],
    verticalModeDefaults: {
            position: {
                            customElement: ResizableTablePosMobileComponent,
                            width: 10,  // percentage
                            maxWidth: 60,   // pixels
                            shortname: "Pos"
                      },
            nr: {
                width: 15,
                maxWidth: 60,
                shortname: "Nr"
            },
            lastname: {
                width: 40,
                justifyStart: true,
                customElement: ResizableTableSurnameMobileComponent
            },
            best_lap_time: {
                width: 35,
                justifyStart: true,
                customElement: ResizableTableFastestLapComponent
            }
    },
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
            label: "Country",
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
            label: "Best lap time",
            defaultWidth: 150,
            customElement: ResizableTableFastestLapComponent
        },
        best_lap: {
            label: "Best lap",
            defaultWidth: 120,
        },
        finished_time: {
            label: "Time taken",
            defaultWidth: 150,
            customElement: ResizableTableTimeTakenComponent
        },
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

const socket = io(getBackendServerAddr());

export const RaceHistoryRace = () => {

    const {date, track_name, eventId} = useParams();
    const bg = localStorage.getItem("background");
    const [raceData, setRaceData] = useState<any>(null);
    const [fieldsData, setFieldData] = useState<any>(fields);
    const [fontSize, setFontSize] = useState<number>(fontSizeOptions[0].value);
    const [selectedColors, setSelectedColors] = useState<any>(["#1a1e2e", "#141721"]);
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [showSettings, setShowSettings] = useState<boolean>(false);

    // Media queries
    const isTabletOrMobile = useMediaQuery({ query: "(max-width: 850px)" });
    const splitRaceWinners = useMediaQuery({ query: "(max-width: 690px)" });
    const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });

    const getData = async () => {
        const searchData = {
            track_name: track_name,
            id: eventId,
            date: date
        };
        socket.emit("getRaceData", searchData, (resp: any) => {
            setRaceData(resp);
        });
    };
    const getFilterData = (data: any) => {
        setFieldData({...fieldsData, enabled: data.fields, enabledClasses: data.classes});
    };

    useEffect(() => {
        if (date && track_name && eventId) {
            getData();
        }
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
                {
                    !raceData &&
                    <div
                        className="app__historyRace-table-wrapper-load"
                        style={{
                            backgroundImage: `url('/svg/Loading.svg')`,
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                        }}
                    />
                }
                <div className={isTabletOrMobile ? "mobile__historyRace-data" : "app__historyRace-data"}>
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
                        <RaceHistoryRaceWinners
                            data={raceData}
                            mediaQuery={{
                                mobile: isTabletOrMobile,
                                portrait: isPortrait,
                                split: splitRaceWinners,
                            }}
                        />
                        <div className="app__historyRace-data-bottom-filter">
                            {
                                !isTabletOrMobile &&
                                <div className="app__historyRace-data-bottom-settings-toggle">
                                    <IoMdSettings size={"90%"} onClick={(e) => { setShowSettings(!showSettings) }}/>
                                </div>
                            }
                            {
                                !isTabletOrMobile &&
                                <div className="app__historyRace-data-bottom-filter-toggle">
                                    <IoFilterOutline size={"90%"} onClick={(e) => { setShowFilters(!showFilters) }} />
                                </div>
                            }
                            {
                                <ResizableTableFilter data={{
                                    competitor: raceData?.competitor_data,
                                    race_info: raceData?.race_data
                                    }}
                                fields={fields}
                                callback={getFilterData}
                                show={showFilters}
                                mediaQuery={{
                                    mobile: isTabletOrMobile,
                                    portrait: isPortrait,
                                }}
                                />
                            }
                        </div>
                    </div>
                    {
                        showSettings &&
                        <div
                            className={`app__historyRace-settings ${showSettings && "historyRace-settings-50"}`}
                            style={{overflow: showSettings ? "visible" : "hidden"}}
                        >
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
                            <div className="app__historyRace-settings-selector">
                                <IoColorPalette size={"25px"} color="azure"/>
                                <input type="color" id="i65" defaultValue={selectedColors[0]} onChange={(e) => {setSelectedColors([e.target.value ,selectedColors[1]])}}/>
                                <input type="color" id="i64" defaultValue={selectedColors[1]} onChange={(e) => {setSelectedColors([selectedColors[0], e.target.value])}}/>
                            </div>
                        </div>
                    }
                </div>
                {
                    isTabletOrMobile && !isPortrait &&
                    <div className="mobile__historyRace-table-settings">
                        <div className="app__historyRace-data-bottom-filter-toggle">
                            <IoFilterOutline size={"30px"} color={"azure"} onClick={(e) => { setShowFilters(!showFilters) }} />
                        </div>
                    </div>
                }
                {
                    isTabletOrMobile ?
                    isPortrait ? <div className="mobile__historyRace-data-portait-info">
                                    <p>
                                        <FcRotateToPortrait size={"25px"}/>
                                        Rotate your device horizontaly for detailed results
                                    </p>
                                    <div className="mobile__historyRace-data-portait-info-close">
                                        <AiOutlineClose  size={"20px"} color="#1d5ebf"/>
                                    </div>
                                 </div>
                    : <div className="mobile__historyRace-data-non-portait-info">
                        <p>
                            <FcRotateToLandscape size={"25px"}/>
                            Rotate your device verticaly for simplified results
                        </p>
                        <div className="mobile__historyRace-data-portait-info-close">
                            <AiOutlineClose  size={"20px"} color="#1d5ebf"/>
                        </div>
                      </div>
                    : ""
                }
                <div
                    className="app__historyRace-table"
                    style={{width: isTabletOrMobile ? "100vw" : "1600px"}}
                >
                    <ResizableTable data={{
                                        competitor: raceData?.competitor_data,
                                        race_info: raceData?.race_data
                                        }}
                                        fields={fieldsData}
                                        fontSize={fontSize}
                                        colors={selectedColors}
                                        mediaQuery={{
                                            mobile: isTabletOrMobile,
                                            portrait: isPortrait,
                                        }}
                    />
                </div>
            </div>
        </div>
    );
};

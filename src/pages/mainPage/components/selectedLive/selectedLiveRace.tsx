import "./selectedLiveRace.scss";
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { RiFullscreenLine} from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import { BiFontSize } from "react-icons/bi";
import { BsArrowDownShort, BsArrowUpShort, BsFillCircleFill } from "react-icons/bs";
import { IoColorPalette, IoFilterOutline } from "react-icons/io5";
import ResizableTable from "../../../../components/ResizableTable";
import { useMediaQuery } from "react-responsive";
import ResizableTableFilter from "../../../../components/ResizableFilter";

interface raceDataElement {
    race_details: any;
    race_competitors_list: any;
    race_time: any;
};

function flagToColor(flag: string): string {
    switch (flag) {
        case "Unknown": return "#0f101a";
        case "Green":   return "#47ba79";
        case "Yellow":  return "#f7e705";
        case "Red":     return "#ed4747";
        case "Finish":  return "repeating-conic-gradient(#f2f0f0 0% 25%, #000000 0% 50%) 50% / 4px 4px";
        case "WarmUp":  return "#b205f7";
        default: return "#0f101a";
    };
};

const getPositionArrow = (positionChange: string, size = 20) => {
    if (!positionChange) return;

    switch (positionChange) {
      case "+": return <BsArrowUpShort size={size} color={"#2dcc30"}/>
      case "-": return <BsArrowDownShort size={size} color={"#ff3636"}/>
      case "F": return <img className="finish_flag" src={"/flags/finish_small.png"} alt="-" />
      default:  return <BsFillCircleFill size={10} color={"#FFF"}/>
    }
  };

function getRaceTime(data: any) {
    if (!data) {
        return "";
    }
    if (["Finish"].includes(data?.race_details?.flag)) {
        return "FINISH";
    }
    if (["Unknown"].includes(data?.race_details?.flag)) {
        return "RACE FINISHED";
    }
    if (data?.race_details?.laps === 1) {
        return "FINAL LAP";
    }
    const raceTimerData = (data.race_details.laps !== 9999 ? { name: "LAPS ", data: data.race_details.laps } : {
        name: data.race_details.race_type_id === 2 ? "TO GO " : "TIME ",
        data: (data.race_time?.left_time !== "00:00:00" ? (data.race_time?.left_time.startsWith("00:") ? data.race_time?.left_time.slice(3) : data.race_time.left_time) : (data.race_time?.elapsed_time.startsWith("00:") ? data.race_time?.elapsed_time.slice(3) : data.race_time.elapsed_time))
    });
    return `${raceTimerData.name} : ${raceTimerData.data}`;
};

const ResizableTableSurnameComponent = (props: any) => {
    return (
        <span className="resized_position_surname">{props?.data}</span>
    );
};
const ResizableTablePosComponent = (props: any) => {
    return (
        <div className="resized_position_wrapper">
            <p>{props.data}</p>
        </div>
    );
};
const ResizableTableImgComponent = (props: any) => {
    if (!props.data) { return; }
        return (
            <img src={`https://flagcdn.com/${props.data?.toLowerCase()}.svg`} alt={props.name}/>
        );
};
const ResizableTableStatusComponent = (props: any) => {
    if (!props.data) { return; }

        return (
            getPositionArrow(props.data)
        );
};

const fields = {
    banned: ["position_by_time", "position_by_lap", "diff_by_time", "diff_by_lap", "gap_by_time", "gap_by_lap", "position_change_by_time", "position_change_by_lap", "finished_time"],
    enabled: ["position", "nr", "state", "status", "firstname", "lastname", "class", "team", "lap", "best_lap_time", "gap", "diff", "lap_time"],
    verticalModeDefaults: {
            position: {
                            width: 10,  // percentage
                            maxWidth: 60,   // pixels
                            shortname: "Pos"
                      },
            nr: {
                width: 15,
                maxWidth: 60,
                shortname: "Nr"
            },
            state: {
                width: 10,
                maxWidth: 80,
                shortname: "State"
            },
            firstname: { width: 30, justifyStart: true},
            lastname: { width: 30, justifyStart: true},
    },
    enabledClasses: [],
    defaultFontSize: 20,
    order: ["position", "nr", "state", "state2", "status", "firstname", "lastname", "class", "team", "make", "lap", "best_lap_time", "lap_time", "elapsed_time", "diff", "gap"],
    config: {
        position: {
            customElement: ResizableTablePosComponent,
            label: "Position",
            defaultWidth: 90
        },
        nr: { label: "Start nr", defaultWidth: 90 },
        state: {
            customElement: ResizableTableImgComponent,
            label: "Country",
            isImageElement: true,
            defaultWidth: 90
        },
        state2: {
            customElement: ResizableTableImgComponent,
            label: "Country 2",
            defaultWidth: 90
        },
        status: {
            customElement: ResizableTableStatusComponent,
            label: "Change",
            defaultWidth: 90,
        },
        firstname: { label: "Name", defaultWidth: 220 },
        lastname: {
            customElement: ResizableTableSurnameComponent,
            label: "Surname",
            defaultWidth: 220
        },
        best_lap_time: {
            label: "Fastest lap time",
            defaultWidth: 150,
        },
        lap_time: {
            label: "Last lap time",
        },
        elapsed_time: {
            label: "Elapsed time",
        },
        make: { label: "Make" },
        team: { label: "Team", defaultWidth: 140 },
        lap: { label: "Laps" },
        diff: { label: "Diff", defaultWidth: 90 },
        gap: { label: "Gap", defaultWidth: 90 },
        class: { label: "Class"},
    }
};

const defaultScoreboardColors = ["#1c2431d0", "#191b26d0", "#235430", "#ffffff"];

export const SelectedLiveRace = () => {
    const {hash} = useParams();
    const navigate = useNavigate();
    const [activeRace, setActiveRace] = useState<raceDataElement>();
    const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>(defaultScoreboardColors);
    const [fieldsData, setFieldData] = useState<any>(fields);

    const bg = localStorage.getItem("background");

    const [showFilters, setShowFilters] = useState<boolean>(false);

    const [scrollSpeed, setScrollSpeed] = useState(1); // Adjust scroll speed as needed
    const [enableAutoScroll, setEnableAutoScroll] = useState(false);

    // Media queries
    const isTabletOrMobile = useMediaQuery({ query: "(max-width: 850px)" });
    const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });

    const [openedTabs, setOpenedTabs] = useState<any>({
        color: false,
        fontSize: false,
        settings: false,
    });

    const getFilterData = (data: any) => {
        setFieldData({...fieldsData, enabled: data.fields, enabledClasses: data.classes});
    };

    function openTab(tabName: string) {
        const tmp = {...openedTabs, color: false, fontSize: false, settings: false};
        tmp[tabName] = !openedTabs[tabName];
        setOpenedTabs(tmp);
    }
    function getSelectedColors(): string[] {
        return [
            (document.getElementById("input__color-prim") as HTMLInputElement)?.value,
            (document.getElementById("input__color-sec") as HTMLInputElement)?.value,
            (document.getElementById("input__color-highlight") as HTMLInputElement)?.value,
            (document.getElementById("input__color-font") as HTMLInputElement)?.value
        ];
    };

    const handleSpeedChange = (newSpeed: number) => {
        setScrollSpeed(newSpeed);
      };

    useEffect(() => {
        const getActiveRace = async () => {
            try {
                if (!hash) { return; }
                const response = await fetch(`http://localhost:3015/api/activeRace?id=${hash}`);
                const data = await response.json();
                setActiveRace(data?.data);
            } catch (err) {
                console.log(err);
            }
        }
        const interval = setInterval(getActiveRace, 1000);
        return() => {
            clearInterval(interval)
        }
    }, []);

    return (
        <div className="app_liveList-selected-main">
            {
                openedTabs.color &&
                <div className="app_liveList-top-selector">
                    <div className="app_liveList-color-selector-item">
                        <header>Primary</header>
                        <input type="color" id="input__color-prim" defaultValue={selectedColors[0]} />
                    </div>
                    <div className="app_liveList-color-selector-item">
                        <header>Secondary</header>
                        <input type="color" id="input__color-sec" defaultValue={selectedColors[1]} />
                    </div>
                    <div className="app_liveList-color-selector-item">
                        <header>Highlight</header>
                        <input type="color" id="input__color-highlight" defaultValue={selectedColors[2]} />
                    </div>
                    <div className="app_liveList-color-selector-item">
                        <header>Font</header>
                        <input type="color" id="input__color-font" defaultValue={selectedColors[3]} />
                    </div>
                    <div className="app_liveList-color-selector-btns">
                        <button onClick={() => { setSelectedColors(getSelectedColors())}}>Save colors</button>
                        <button onClick={() => { setSelectedColors(defaultScoreboardColors) }}>Reset to default</button>
                    </div>
                </div>
            }
            {
                openedTabs.settings &&
                <div className="app_liveList-top-selector">
                    <div className="app__liveList-top-settings-autoscroll">
                        <header>Autoscroll</header>
                        <div className="app__liveList-top-settings-autoscroll-item">
                            <header>Enabled</header>
                            <input type="checkbox" id="input__autoscroll-enable" onChange={() => {
                                setEnableAutoScroll((document.getElementById("input__autoscroll-enable") as HTMLInputElement)?.checked);
                            }}/>
                        </div>
                        <div className="app__liveList-top-settings-autoscroll-item">
                            <header>Pause seconds</header>
                            <input type="number" />
                        </div>
                    </div>
                    <div className="app__liveList-top-settings-show">
                        <header>Auto change pages</header>
                        <input type="checkbox" />
                    </div>
                </div>
            }
            {
                activeRace ?
                <div
                    className="app_liveList-selected-results"
                    style={{
                        backgroundImage: bg ? `url('/svg/${bg}.svg')` : "url('/svg/Squares.svg')",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                    }}
                >
                    <header>
                        <div className="app_liveList-selected-track-name">
                            <p>{activeRace?.race_details?.name}</p>
                            <span>{activeRace?.race_details?.track_name}</span>
                            <span>{`Track length: ${activeRace?.race_details?.track_length} km`}</span>
                        </div>
                        <div className="app_liveList-selected-time">
                            <p>{getRaceTime(activeRace)}</p>
                        </div>
                        <div
                            className="app_liveList-selected-time-flag-line"
                            style={{background: flagToColor(activeRace?.race_details?.flag)}}
                        />
                        <div className="app_liveList-selected-flag-and-chart">

                        </div>
                        <button className="app_liveList-selected-fullscreen"
                            onClick={() => { navigate(`/live/full/${hash}`) }}
                        >
                            Fullscreen
                            <RiFullscreenLine color="#ffffff" size={"20px"}/>
                        </button>
                        <div className="app_liveList-selected-settings">
                            <button className="app_liveList-selected-settings-btn"
                                onClick={() => { openTab("color") }}
                            >
                                <IoColorPalette color="#ffffff" size={"25px"}/>
                            </button>
                            <button className="app_liveList-selected-settings-btn">
                                <BiFontSize color="#ffffff" size={"25px"}/>
                            </button>
                            <button className="app_liveList-selected-settings-btn"
                                onClick={() => { setShowFilters(!showFilters) }}
                            >
                                <IoFilterOutline color="#ffffff" size={"25px"}/>
                            </button>
                            <button className="app_liveList-selected-settings-btn"
                                onClick={() => { openTab("settings") }}
                            >
                                <IoMdSettings color="#ffffff" size={"25px"}/>
                            </button>
                        </div>
                    </header>
                    <div className="app__live-filter">
                        <ResizableTableFilter data={{
                                competitor: activeRace?.race_competitors_list,
                                race_info: activeRace?.race_details
                                }}
                            fields={fields}
                            callback={getFilterData}
                            show={showFilters}
                            mediaQuery={{
                                mobile: isTabletOrMobile,
                                portrait: isPortrait,
                            }}
                        />
                    </div>
                    <div
                        className="app__historyRace-table"
                        style={{width: isTabletOrMobile ? "100vw" : "1600px"}}
                    >
                        <ResizableTable data={{
                                            competitor: activeRace?.race_competitors_list,
                                            race_info: activeRace?.race_details
                                            }}
                                            fields={fieldsData}
                                            fontSize={0.8}
                                            colors={selectedColors}
                                            mediaQuery={{
                                                mobile: isTabletOrMobile,
                                                portrait: isPortrait,
                                            }}
                        />
                    </div>
                    <div className="app__live_raceLeaders">
                        <div className="app__live_raceLeaders-inner">
                            <span>Info about race leader/ 2nd place / 3rd place / fastest lap</span>
                            <p>Enable simulator button here?</p>
                        </div>
                    </div>
                    <div className="app__Simulator">
                        <div className="simulator_inner">
                            Simulator goes herere heehehhehe
                        </div>

                    </div>
                </div>
                :
                <div className="app_liveList-selected-loading">
                    <div
                        className="load-wheel"
                        style={{
                            backgroundImage: `url('/svg/Wheel.svg')`,
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                        }}
                    />
                </div>
            }
        </div>
    );
};
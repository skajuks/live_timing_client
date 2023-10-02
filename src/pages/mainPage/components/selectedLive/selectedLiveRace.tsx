import "./selectedLiveRace.scss";
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { RiFullscreenLine} from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import { BiFontSize } from "react-icons/bi";
import { BsArrowDownShort, BsArrowUpShort, BsFillCircleFill } from "react-icons/bs";
import { IoColorPalette } from "react-icons/io5";
import { TbArrowAutofitDown } from "react-icons/tb";

interface raceDataElement {
    race_details: any;
    race_competitors_list: any;
    race_time: any;
};

function flagToColor(flag: string): string {
    switch (flag) {
        case "Unknown": return "#000";
        case "Green":   return "#47ba79";
        case "Yellow":  return "#f7e705";
        case "Red":     return "#ed4747";
        case "Finish":  return "repeating-conic-gradient(#f2f0f0 0% 25%, #000000 0% 50%) 50% / 4px 4px";
        case "WarmUp":  return "#b205f7";
        default: return "#000";
    };
};

const getPositionArrow = (positionChange: string, size = 20) => {
    if (!positionChange) return;

    switch (positionChange) {
      case "+": return <BsArrowUpShort size={size} color={"#2dcc30"}/>
      case "-": return <BsArrowDownShort size={size} color={"#ff3636"}/>
      case "F": return <img src={"/flags/finish_small.png"} alt="-" />
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

const legendData: Object[] = [
    {name: "Pos", width: "40px"},
    {name: "Nr", width: "60px"},
    {name: "State", width: "60px"},
    {name: "Status", width: "60px"},
    {name: "Name", width: "160px"},
    {name: "Surname", width: "160px"},
    {name: "Class", width: "100px"},
    {name: "Team", width: "160px"},
    {name: "Lap", width: "60px"},
    {name: "Last time", width: "140px"},
    {name: "Best time", width: "140px"},
    {name: "Diff", width: "140px"},
    {name: "Gap", width: "140px"},
    {name: "Speed", width: "140px"},
];

const defaultScoreboardColors = ["#1c2431", "#191b26", "#235430", "#ffffff"];

export const SelectedLiveRace = () => {
    const {hash} = useParams();
    const navigate = useNavigate();
    const [activeRace, setActiveRace] = useState<raceDataElement>();
    const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>(defaultScoreboardColors);

    const autoscrollRef = useRef(null);
    const [scrollSpeed, setScrollSpeed] = useState(1); // Adjust scroll speed as needed
    const [enableAutoScroll, setEnableAutoScroll] = useState(false);
    const [isScrolling, setIsScrolling] = useState(true);

    const [openedTabs, setOpenedTabs] = useState<any>({
        color: false,
        fontSize: false,
        settings: false,
    });

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
        let scrollInterval: any;
        const container: any = autoscrollRef.current;

        const scrollBottom = () => {
            if (container && enableAutoScroll) {
                if (!enableAutoScroll) {
                    container.scrollTop = 0;
                    return;
                } else {
                    container.scrollTop += scrollSpeed;
                    if (container.scrollTop >= container.scrollHeight - container.clientHeight) {
                        setIsScrolling(false);
                        clearInterval(scrollInterval);
                        setTimeout(() => {
                            setIsScrolling(true);
                            scrollInterval = setInterval(scrollTop, 10);
                        }, 5000); // Pause for 5 seconds at the bottom
                    }
                }
            }
        };

        const scrollTop = () => {
            if (container && enableAutoScroll) {
                container.scrollTop = 0;
                setIsScrolling(false);
                clearInterval(scrollInterval);
                if (enableAutoScroll) {
                    setTimeout(() => {
                        setIsScrolling(true);
                        scrollInterval = setInterval(scrollBottom, 10);
                    }, 5000); // Pause for 5 seconds at the top
                }
            }
        };

        scrollInterval = setInterval(scrollBottom, 10);

        return () => {
          clearInterval(scrollInterval);
        };
      }, [scrollSpeed, enableAutoScroll]);

    useEffect(() => {
        const getActiveRace = async () => {
            try {
                if (!hash) { return; }
                const response = await fetch(`http://localhost:3002/api/activeRace?id=${hash}`);
                const data = await response.json();
                setActiveRace(data?.data?.api_data);
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
            <div className="app_liveList-selected-results">
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
                            onClick={() => { openTab("settings") }}
                        >
                            <IoMdSettings color="#ffffff" size={"25px"}/>
                        </button>
                    </div>
                </header>
                <div className="app__liveList-overflow-x-wrapper">
                    <div className="app__liveList-selected-race-legend">
                        {
                            legendData.map((item: any) =>
                                <div
                                    className="app__liveList-selected-race-legend-item"
                                    style={{width: item.width}}
                                >
                                    {item.name}
                                </div>
                            )
                        }
                    </div>
                    <div
                        className="app__liveList-selected-race-data"
                        ref={autoscrollRef}
                    >
                        {
                            activeRace?.race_competitors_list?.map((item: any, index: number) =>
                                <div
                                    className="app__liveList-selected-race-data-item"
                                    key={`race_live_item_${index}`}
                                    style={{background:
                                                selectedCompetitors.includes(item.nr) ? selectedColors[2] :
                                                index % 2 === 0 ?
                                                selectedColors[0] : selectedColors[1],
                                            color: selectedColors[3]
                                        }}
                                    onClick={() => {
                                        if (selectedCompetitors.includes(item.nr)) {
                                            setSelectedCompetitors(selectedCompetitors.filter(competitor => competitor !== item.nr))
                                        } else {
                                            setSelectedCompetitors([...selectedCompetitors, item.nr])
                                        }
                                    }}
                                >
                                    <div className="app_liveList-item-pos">
                                        {item?.position}
                                    </div>
                                    <div className="app_liveList-item-nr">
                                        {item?.nr}
                                    </div>
                                    <div className="app_liveList-item-state">
                                    {
                                        item.state &&
                                        <img src={`https://flagcdn.com/${item.state?.toLowerCase()}.svg`} alt="-" />
                                    }
                                    </div>
                                    <div className="app_liveList-item-status">
                                        {getPositionArrow(item?.status)}
                                    </div>
                                    <div className="app_liveList-item-firstname">
                                        {item?.firstname}
                                    </div>
                                    <div className="app_liveList-item-lastname">
                                        {item?.lastname}
                                    </div>
                                    <div className="app_liveList-item-class">
                                        {item?.class}
                                    </div>
                                    <div className="app_liveList-item-team">
                                        {item?.team}
                                    </div>
                                    <div className="app_liveList-item-lap">
                                        {item?.lap}
                                    </div>
                                    <div className="app_liveList-item-last_time">
                                        {item?.lap_time}
                                    </div>
                                    <div className="app_liveList-item-best_time">
                                        {item?.best_lap_time}
                                    </div>
                                    <div className="app_liveList-item-best_time">
                                        {item?.diff}
                                    </div>
                                    <div className="app_liveList-item-best_time">
                                        {item?.gap}
                                    </div>
                                    <div className="app_liveList-item-best_time">
                                        {item?.speed}
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
            <div className="app_liveList-selected-divider" />
            <div className="app_liveList-selected-simulator">

            </div>
        </div>
    );
};
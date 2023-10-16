import { useEffect, useState } from "react";
import "./selectedLiveFull.scss";
import { useNavigate, useParams } from "react-router-dom";
import { RiFullscreenLine } from "react-icons/ri";
import { BsArrowDownShort, BsArrowUpShort, BsFillCircleFill } from "react-icons/bs";

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

const legendData: Object[] = [
    {name: "Pos", width: "5%"},
    {name: "Nr", width: "5%"},
    {name: "State", width: "5%"},
    {name: "Status", width: "5%"},
    {name: "Name", width: "10%"},
    {name: "Surname", width: "10%"},
    {name: "Class", width: "10%"},
    {name: "Team", width: "10%"},
    {name: "Lap", width: "5%"},
    {name: "Last time", width: "8%"},
    {name: "Best time", width: "8%"},
    {name: "Diff", width: "7%"},
    {name: "Gap", width: "7%"},
    {name: "Speed", width: "6%"},
];

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

export function SelectedLiveFull() {

    const {hash} = useParams();
    const navigate = useNavigate();
    const [activeRace, setActiveRace] = useState<raceDataElement>();
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const getActiveRace = async () => {
            try {
                if (!hash) { return; }
                const response = await fetch(`http://192.168.8.252:3002/api/activeRace?id=${hash}`);
                const data = await response.json();
                console.log(data?.data?.api_data);
                if (data?.data?.api_data?.race_competitors_list?.length > 15) {
                    const maxPages = Math.ceil(data?.data?.api_data?.race_competitors_list?.length / 15);
                    console.log(maxPages);
                    // If there are more than 12 entries, show the entries for the current page.
                    setActiveRace({
                        race_details: data.data.api_data?.race_details,
                        race_competitors_list: data?.data?.api_data?.race_competitors_list?.slice((currentPage - 1) * 15, currentPage * 15),
                        race_time: data.data?.api_data?.race_time
                    });
                    // Schedule moving to the next page after 10 seconds.
                    setTimeout(() => {
                        if (currentPage < maxPages) {
                            setCurrentPage(currentPage + 1);
                        } else {
                            setCurrentPage(1); // Reset to the first page when reaching the last page.
                        }
                    }, 10000);
                } else {
                    setActiveRace(data?.data?.api_data);
                }
            } catch (err) {
                console.log(err);
            }
        }
        const interval = setInterval(getActiveRace, 1000);
        return() => {
            clearInterval(interval)
        }
    }, [currentPage]);

    return (
        <div
            className="app_liveList-fullscreen"
            style={{backgroundImage: "url(/svg/Lines.svg)"}}
        >
            {
                activeRace &&
                <header>
                    <div className="app_liveList-fullscreen-track-name">
                        <p>{activeRace?.race_details?.name}</p>
                        <span>{activeRace?.race_details?.track_name}</span>
                        <span>{`Track length: ${activeRace?.race_details?.track_length} km`}</span>
                    </div>
                    <div className="app_liveList-fullscreen-time">
                        <p>{getRaceTime(activeRace)}</p>
                    </div>
                    <div
                        className="app_liveList-fullscreen-flag-line"
                        style={{background: flagToColor(activeRace?.race_details?.flag)}}
                    />
                    <button className="app_liveList-fullscreen-toggle"
                        onClick={() => { navigate(`/live/${hash}`) }}
                    >
                        <RiFullscreenLine color="#ffffff" size={"20px"}/>
                    </button>
                </header>
            }
            {
                activeRace ?
                <div className="app_liveList-fullscreen-data">
                    <div className="app_liveList-fullscreen-legend">
                        {
                            legendData.map((item: any, index: number) =>
                                <div
                                    className="app_liveList-fullscreen-legend-item"
                                    style={{width: item.width}}
                                    key={`race_live_item_legend_${index}`}
                                >
                                    {item.name}
                                </div>
                            )
                        }
                    </div>
                    <div className="app_liveList-fullscreen-comp-data">
                        {
                            activeRace?.race_competitors_list?.map((item: any, index: number) =>
                                <div
                                    className="app_liveList-fullscreen-item"
                                    key={`race_live_item_${index}`}
                                >
                                    <div className="app_liveList-fullscreen-pos">
                                        <div className="app_liveList-fullscreen-pos-inner">
                                            {item?.position}
                                        </div>
                                    </div>
                                    <div className="app_liveList-fullscreen-nr">
                                        {item?.nr}
                                    </div>
                                    <div className="app_liveList-fullscreen-5">
                                    {
                                        item.state &&
                                        <img src={`https://flagcdn.com/${item.state?.toLowerCase()}.svg`} alt="-" />
                                    }
                                    </div>
                                    <div className="app_liveList-fullscreen-position-c">
                                        {getPositionArrow(item?.status)}
                                    </div>
                                    <div className="app_liveList-fullscreen-10">
                                        {item?.firstname}
                                    </div>
                                    <div className="app_liveList-fullscreen-10 lastname_bold">
                                        {item?.lastname}
                                    </div>
                                    <div className="app_liveList-fullscreen-10">
                                        {item?.class}
                                    </div>
                                    <div className="app_liveList-fullscreen-10">
                                        {item?.team}
                                    </div>
                                    <div className="app_liveList-fullscreen-5">
                                        {item?.lap}
                                    </div>
                                    <div className="app_liveList-fullscreen-8">
                                        {item?.lap_time}
                                    </div>
                                    <div className="app_liveList-fullscreen-8">
                                        {item?.best_lap_time}
                                    </div>
                                    <div className="app_liveList-fullscreen-7">                                        {item?.diff}
                                    </div>
                                    <div className="app_liveList-fullscreen-7">
                                        {item?.gap}
                                    </div>
                                    <div className="app_liveList-fullscreen-6">
                                        {item?.speed}
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
                :
                <div className="app_liveList-fullscreen-loading">
                    <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
                    <p>Entering Fullscreen mode...</p>
                </div>

            }
        </div>
    );
};
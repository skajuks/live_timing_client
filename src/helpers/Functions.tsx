import { BsArrowDownShort, BsArrowUpShort, BsFillCircleFill } from "react-icons/bs";

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
    const raceTimerData = (data.race_details?.laps !== 9999 ? { name: "LAPS ", data: data.race_details?.laps } : {
        name: data.race_details?.race_type_id === 2 ? "TO GO " : "TIME ",
        data: (data.race_time?.left_time !== "00:00:00" ? (data.race_time?.left_time.startsWith("00:") ? data.race_time?.left_time?.slice(3) : data.race_time?.left_time) : (data.race_time?.elapsed_time?.startsWith("00:") ? data.race_time?.elapsed_time?.slice(3) : data.race_time?.elapsed_time))
    });
    return `${raceTimerData.name} : ${raceTimerData.data}`;
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

function getPositionArrow(positionChange: string, size = 20) {
    if (!positionChange) return;

    switch (positionChange) {
      case "+": return <BsArrowUpShort size={size} color={"#2dcc30"}/>
      case "-": return <BsArrowDownShort size={size} color={"#ff3636"}/>
      case "F": return <img className="finish_flag" src={"/flags/finish_small.png"} alt="-" />
      default:  return <BsFillCircleFill size={10} color={"#FFF"}/>
    }
};

export { getRaceTime, flagToColor, getPositionArrow }
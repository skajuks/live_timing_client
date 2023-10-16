import "./liveList.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdLocationPin } from "react-icons/md";
import { BoardTable } from "../../../../components/ScoreboardTable/ScoreboardTable";

interface raceTypeData {
    race_type_name: string;
    race_type_id: number;
}
interface raceInfoElement {
    token: string;
    race_name: string;
    track_name: string;
    id: number;
    laps: number;
    flag: string;
    elapsed_time: string;
    race_type_data: raceTypeData;
};

export const LiveList: React.FC = () => {
    const [activeRaces, setActiveRaces] = useState<raceInfoElement[]>([]);
    const navigate = useNavigate();

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

    const getFlagElement = (item: any) => {
        return (
            <div className="__board_table_flag_element" style={{background: flagToColor(item?.flag)}}/>
        );
    };

    useEffect(() => {
        const getActiveRaces = async () => {
            try {
                const response = await fetch("http://192.168.8.252:3002/api/activeRaces");
                const data = await response.json();
                setActiveRaces(data);
            } catch (err) {
                console.log(err);
            }
        }
        getActiveRaces();
    }, [])

    return (
        <div
            className="app_liveList-main"
            style={{backgroundImage: "url('/svg/Lines.svg')"}}
        >
            <header>
                <h3>Live Timing</h3>
                <p>View all ongoing races.</p>
            </header>
            <BoardTable
                legend={[
                    {data: "race_sport", dataParent: "", name: "Type", width: 5, img: true, center: true, customSrc: "/icons/", customElement: ""},
                    {data: "race_state", dataParent: "", name: "State", width: 5, img: true, center: true, customSrc: "", customElement: ""},
                    {data: "race_type_name", dataParent: "race_type_data", name: "Run Type", width: 8, img: false, center: true, customSrc: "", customElement: ""},
                    {data: "flag", dataParent: "", name: "Flag", width: 5, img: false, center: true, customSrc: "", customElement: getFlagElement},
                    {data: "track_name", dataParent: "", name: "Track Name", width: 20, img: false, center: true, customSrc: "", customElement: ""},
                    {data: "race_name", dataParent: "", name: "Event Name", width: 40, img: false, center: false, customSrc: "", customElement: ""},
                    {data: "elapsed_time", dataParent: "", name: "Elapsed Time", width: 10, img: false, center: false, customSrc: "", customElement: ""},
                ]}
                data={{}}
                properties={{filters: true, currentPageData: activeRaces, maxPage: 1}}
                functions={{}}
            />
        </div>
    );
};

/*


*/
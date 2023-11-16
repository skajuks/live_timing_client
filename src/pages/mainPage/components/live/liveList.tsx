import "./liveList.scss";
import { useEffect, useState } from "react";
import { BoardTable } from "../../../../components/ScoreboardTable/ScoreboardTable";
import { useNavigate } from "react-router-dom";
import { getBackendServerAddr } from "../../mainPage";
import { io } from "socket.io-client";

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
const addr = getBackendServerAddr();
const socket = io(addr);

export const LiveList: React.FC = () => {
    const [activeRaces, setActiveRaces] = useState<raceInfoElement[]>([]);
    const navigate = useNavigate();

    const [countryFilterValue, setCountryFilterValue] = useState<string>("");
    const [sportFilterValue, setSportFilterValue] = useState<string | null>("");
    const [nameFilterValue, setNameFilterValue] = useState<string>("");
    const [dateFilterValue, setDateFilterValue] = useState<string>("desc");

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

    const getDataWithFilters = async (args: any) => {
        try {
            // Add option to filter out incomming live race feed
        } catch (error) {

        }
    };

    const navigateTo = (item: any) => {
        navigate(`/live/${item.token}`);
    };

    useEffect(() => {
        const getActiveRaces = async () => {
            try {
                socket.emit("getActiveRaces", async (data: any) => {
                    setActiveRaces(data);
                });
            } catch (err) {
                console.log(err);
            }
        }
        getActiveRaces();
    }, []);

    const bg = localStorage.getItem("background");

    return (
        <div
            className="app_liveList-main"
            style={{
                backgroundImage: bg ? `url('/svg/${bg}.svg')` : "url('/svg/Lines.svg')",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
            }}
        >
            <header>
                <h3>Live Timing</h3>
            </header>
            <BoardTable
                legend={[
                    {data: "race_sport", dataParent: "", name: "Type", width: 5, minWidth: 60, img: true, center: true, customSrc: "/icons/", customElement: ""},
                    {data: "race_state", dataParent: "", name: "State", width: 5, minWidth: 60, img: true, center: true, customSrc: "", customElement: ""},
                    {data: "race_type_name", dataParent: "race_type_data", name: "Run Type", width: 10, minWidth: 80, img: false, center: true, customSrc: "", customElement: ""},
                    {data: "flag", dataParent: "", name: "Flag", width: 8, minWidth: 60, img: false, center: true, customSrc: "", customElement: getFlagElement},
                    {data: "track_name", dataParent: "", name: "Track Name", width: 20, minWidth: 150, img: false, center: true, customSrc: "", customElement: ""},
                    {data: "race_name", dataParent: "", name: "Event Name", width: 40, minWidth: 150, img: false, center: false, customSrc: "", customElement: ""},
                    {data: "elapsed_time", dataParent: "", name: "Elapsed Time", width: 12, minWidth: 120, img: false, center: false, customSrc: "", customElement: ""},
                ]}
                data={{}}
                properties={{filters: true, currentPageData: activeRaces, maxPage: 1}}
                functions={{
                    setCountryFilterValue: setCountryFilterValue, setSportFilterValue: setSportFilterValue,
                    setNameFilterValue: setNameFilterValue, setDateFilterValue: setDateFilterValue
                }}
                customFunctions={{filters: getDataWithFilters, navigateTo: navigateTo}}
            />
        </div>
    );
};

/*


*/
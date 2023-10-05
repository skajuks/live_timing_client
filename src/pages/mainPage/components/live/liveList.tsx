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

    useEffect(() => {
        const getActiveRaces = async () => {
            try {
                const response = await fetch("http://localhost:3002/api/activeRaces");
                const data = await response.json();
                setActiveRaces(data);
            } catch (err) {
                console.log(err);
            }
        }
        getActiveRaces();
    }, [])

    function handleClickEvent(token: string) {
        navigate(`/live/${token}`);
    };

    return (
        <div
            className="app_liveList-main"
        >
            <header>
                Live Timing
                <p>View all ongoing races.</p>
            </header>
            <BoardTable
                legend={[
                    {data: "race_name", name: "Type", width: 5, img: false, center: true, customSrc: ""},
                    {data: "track_name", name: "Type", width: 5, img: false, center: true, customSrc: ""},
                    {data: "race_flag", name: "Event Name", width: 40, img: false, center: false, customSrc: ""},
                ]}
                data={{}}
                properties={{}}
            />
            <div className="app_liveList-selector-wrapper">
                <div className="app_liveList-selector">
                    <div className="app_liveList-selector-item"
                        style={{width: "50%"}}
                    >
                        Race name
                    </div>
                    <div className="app_liveList-selector-item"
                        style={{width: "30%"}}
                    >
                        Track name
                    </div>
                    <div className="app_liveList-selector-item">
                        Date
                    </div>
                    <div className="app__liveList-selector-filters">
                        <div className="app__liveList-selector-filter-item">
                            <img src="/icons/moto.png" alt="" />
                        </div>
                        <div className="app__liveList-selector-filter-item">
                            <img src="/icons/car.png" alt="" />
                        </div>
                        <div className="app__liveList-selector-filter-item">
                            <img src="/icons/kart.png" alt="" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="app_liveList-content">
                {
                    activeRaces && activeRaces.map((item, index) =>
                        <div
                            className="app_liveList-item"
                            key={`${index}_live_race_item`}
                            onClick={() => { handleClickEvent(item.token) }}
                        >
                            <div className="app__liveList-item-race-name">{item.race_name}</div>
                            <div className="app_liveList-item-name">
                                <MdLocationPin color="#ffffff" size={"18px"}/>
                                <p>{item.track_name}</p>
                                <p>{item.race_type_data?.race_type_name}</p>
                                <p>{item.flag}</p>
                            </div>

                            <button></button>
                        </div>
                    )
                }
            </div>
        </div>
    );
};
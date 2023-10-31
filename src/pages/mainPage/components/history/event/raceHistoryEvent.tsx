import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BsPlayFill } from "react-icons/bs";
import "./raceHistoryEvent.scss";
import { parseDate } from '../../../../../helpers/Parsers';
import { BoardTable } from '../../../../../components/ScoreboardTable/ScoreboardTable';

interface EventData {
    championship: string,
    country_code: string,
    race_sport: number,
    date: string,
    end_time: string,
    start_time: string,
    id: number,
    name: string,
    race_type: string,
    track_name: string,
    track_length: string
};

export const RaceHistoryEvent = () => {

    const navigate = useNavigate();
    const {date, track_name} = useParams();
    const [eventData, setEventData] = useState<EventData[]>([]);

    const getEventData = async (date: string, track_name: string) => {
        const response = await fetch(`http://localhost:3015/api/getEventData?date=${date}&track_name=${track_name}`);
        const data = await response.json();
        setEventData(data.data);
    };

    const navigateTo = (item: any) => {
        navigate(`/history/${date}/${track_name}/${item.id}`);
    };

    useEffect(() => {
        if (!date || !track_name) { return; } // add some 404 page that says race not found or deleted
        getEventData(date, track_name);
    }, []);

    const bg = localStorage.getItem("background");

    return (
        <div
            className="app__historyEvent-main"
            style={{
                backgroundImage: bg ? `url('/svg/${bg}.svg')` : "url('/svg/Squares.svg')",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
            }}
        >
            <header>
                <h3>{track_name}</h3>
                <p>{parseDate(date!)}</p>
            </header>
            <BoardTable
                legend={[
                    {data: "race_type", dataParent: "", name: "Run Type", width: 10, img: false, center: true, customSrc: "", customElement: ""},
                    {data: "name", dataParent: "", name: "Name", width: 70, img: false, center: true, customSrc: "", customElement: ""},
                    {data: "start_time", dataParent: "", name: "Start Time", width: 10, img: false, center: false, customSrc: "", customElement: ""},
                    {data: "end_time", dataParent: "", name: "End Time", width: 10, img: false, center: false, customSrc: "", customElement: ""},
                ]}
                data={{}}
                properties={{navRunHistory: true, currentPageData: eventData, maxPage: 1}}
                functions={{}}
                customFunctions={{navigateTo: navigateTo}}
            />
        </div>
    );
};
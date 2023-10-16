import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
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

    const { state } = useLocation();
    const [eventData, setEventData] = useState<EventData[]>([]);

    const getEventData = async (date: string, trackName: string) => {
        const response = await fetch(`http://192.168.8.252:3002/api/getEventData?date=${date}&track_name=${trackName}`);
        const data = await response.json();
        setEventData(data.data);
    };

    useEffect(() => {
        getEventData(state.eventDate, state.eventTrack);
    }, [state]);

    return (
        <div
            className="app__historyEvent-main"
            style={{backgroundImage: "url('/svg/Lines.svg')"}}
        >
            <header>
                <h3>{state.eventTrack}</h3>
                <p>{parseDate(state.eventDate)}</p>
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
            />
        </div>
    );
};
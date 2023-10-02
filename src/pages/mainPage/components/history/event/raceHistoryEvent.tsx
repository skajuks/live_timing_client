import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BsPlayFill } from "react-icons/bs";
import "./raceHistoryEvent.scss";

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
        const response = await fetch(`http://localhost:3002/api/getEventData?date=${date}&track_name=${trackName}`);
        const data = await response.json();
        console.log(data.data);
        setEventData(data.data);
    };

    useEffect(() => {
        getEventData(state.eventDate, state.eventTrack);
    }, [state])

    return (
        <div className="app_liveList-main">
            <header>{state.eventTrack}</header>
            <div className="app__historyEvent-data">
            {
                eventData && eventData.map((item, index) =>
                    <div
                        className="app__historyEvent-eventItem"
                        key={`${index}_historyEvent-item`}
                    >
                        {item.name}
                        {item.race_type}
                        {item.start_time}
                        {item.end_time || "-"}
                    </div>
                )
            }
            </div>
        </div>
    );
};
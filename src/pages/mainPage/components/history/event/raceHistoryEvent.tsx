import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BsPlayFill } from "react-icons/bs";
import "./raceHistoryEvent.scss";
import { parseDate } from '../../../../../helpers/Parsers';

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
        setEventData(data.data);
    };

    const legend: any = [
        {name: "Name", width: 20, img: false, center: true},
        {name: "Race Type", width: 20, img: true, center: true},
        {name: "Start Time", width: 20, img: false, center: false},
        {name: "End Time", width: 20, img: false, center: false},
    ];
    const legendBar: any = [];

    useEffect(() => {
        getEventData(state.eventDate, state.eventTrack);
    }, [state]);

    const asdasd = (array: any) => {
        array.forEach((item: any, index: number) => {
            legendBar.push(
                <div
                    className="__board_table_legendField"
                    key={`${index}_board_table_field_legend`}
                    style={{
                        width: `${item.width}%`,
                        justifyContent : item.center ? "center" : "flex-start"
                    }}
                >
                <p
                    style={{marginLeft: item.center ? "0px" : "20px"}}
                >{item.name}</p>
                </div>
            )
        })
    };
    asdasd(legend);

    return (
        <div className="app_liveList-main">
            <header>
                {state.eventTrack}
                <p>{parseDate(state.eventDate)}</p>
            </header>
            <div className="__board_table_wrapped">
                <div className="__board_table">
                    <div className="__board_table_legend">
                        {legendBar}
                    </div>
                    <div className="__board_table_data">
                    {
                        eventData && eventData.map((item, index) =>
                            <div
                                className="__board_table_data_item"
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
                    <div className="app__historyGroups_pageChange">

                    </div>
                </div>
            </div>
        </div>
    );
};
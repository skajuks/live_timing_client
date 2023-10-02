import "./ScoreboardTable.scss";
import { useNavigate } from "react-router-dom";

interface BoardField {
    data: string;
    name: string;
    width: number;
    img: boolean;
    center: boolean;
};

interface BoardTableProps {
    legend: BoardField[];
    data: any;
    properties: any; // You can specify a more specific type if needed
  }

export const BoardTable: React.FC<BoardTableProps> = ({legend, data, properties}) => {

    const navigate = useNavigate();

    const legendBar: any = [];
    const legendItems: any = [];
    legend.forEach((item, index) => {
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
        legendItems.push(item);
    })

    return (
        <div
            className="__board_table"
            style={{width: properties.width, height: properties.height}}
        >
            <div className="__board_table_legend">
                {legendBar}
            </div>
            <div className="__board_table_data">
                {
                    data && data.map((item: any, index: number) =>
                        <div
                            className="__board_table_data_item"
                            key={`${index}_board_table_data_item`}
                            onClick={() => {
                                navigate(`/history/${item.id}`, {
                                    state: {
                                        eventId: item.id,
                                        eventTrack: item.event_track_name,
                                        eventDate: item.event_date
                                    }
                                })
                            }}
                        >
                            {
                                legendItems.map((item_name: any, index: number) =>
                                    <p
                                        style={{
                                            width : `calc(${item_name.width}% - ${item_name.center ? 0 : 20}px`,
                                            justifyContent : item_name.center ? "center" : "flex-start",
                                            marginLeft : item_name.center ? "0px" : "20px",
                                        }}
                                        key={`${index}_race_hist_dataItem`}
                                    >{
                                        item_name.img ?
                                        <img src={`https://flagcdn.com/${item?.[item_name.data].toLowerCase()}.svg`} /> :
                                        item?.[item_name.data]
                                    }</p>
                                )
                            }
                        </div>
                    )
                }
            </div>
        </div>
    );  
};
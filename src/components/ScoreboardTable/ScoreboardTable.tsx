import "./ScoreboardTable.scss";
import { useNavigate } from "react-router-dom";
import SelectField from "../Fields/SelectField/SelectField";
import { countries, sports, monthNames } from "../../helpers/static/data";
import { OptionsTransformer } from "../../helpers/OptionsTransformer";
import { parseDate } from "../../helpers/Parsers";
import { BsSortUpAlt, BsSortDownAlt } from "react-icons/bs";

export interface BoardField {
    data: string;
    dataParent: string;
    name: string;
    width: number;
    img: boolean;
    center: boolean;
    customSrc: string;
    customElement: any;
};

export interface BoardTableProps {
    legend: BoardField[];
    data: any;
    properties: any; // You can specify a more specific type if needed
    functions: any;
}

export const BoardTable: React.FC<BoardTableProps> = ({legend, data, properties, functions}) => {

    const navigate = useNavigate();
    const legendBar: any = [];
    const legendItems: any = [];

    const clearValueInput = (id: string) => {
        const el = (document.getElementById(id) as HTMLInputElement);
        if (el && el.value) { el.value = ''; }
    };

    const getDataWithFilters = async (values: any, setCurrentPageData: Function, setMaxPage: Function) => {
        functions.setCurrentPage(1); // set current page to 1
        try {
            const pageStr = `http://localhost:3002/api/getMaxPages?country=${values.ctry}&sports=${values.sports}&name=${values.name}`
            const response = await fetch(pageStr);
            const data = await response.json();
            if (!data.pages || data.pages === 0) {
                setCurrentPageData(null);
                return setMaxPage(data.pages);
            }
            if (data.pages) {
                setMaxPage(data.pages);
                const response = await fetch(`http://localhost:3002/api/getPageEvents?page=${properties.currentPage}&country=${values.ctry}&sports=${values.sports}&date=${values.date}&name=${values.name}`);
                const pageData = await response.json();
                if (pageData.data) {
                    pageData.data.forEach((item: any) => {
                        if (item.event_date) {
                            item.parsed_date = parseDate(item.event_date);
                        } else {
                            item.parsed_date = "";
                        }
                    })
                }
                setCurrentPageData(pageData?.data);
            }
        } catch (error) {

        }
        // get max pages
        // get data for page 1
        // show data
    };

    const insertLegend = (array: any) => {
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
            legendItems.push(item);
        })
    };
    insertLegend(legend);

    return (
        <div className="__board_table_wrapped">
            {
                properties.filters &&
                <div className="__board_table_filter">
                    <div className="__board_table_filter_items">
                        <SelectField
                            className="__board_table_filter_item"
                            id="app__historyGroups_selector_country"
                            options={new OptionsTransformer(countries).get()}
                            name="countries"
                            label="Country"
                            onChange={(val : any) => {
                                functions.setCountryFilterValue(val);
                                getDataWithFilters({ctry: val,
                                                    sports: properties.sportFilterValue,
                                                    date: properties.dateFilterValue,
                                                    name: properties.nameFilterValue
                                },
                                functions.currentPage,
                                functions.maxPage
                                );
                            }}
                        />
                        <SelectField
                            className="__board_table_filter_item"
                            id="app__historyGroups_selector_sport"
                            options={new OptionsTransformer(sports).get()}
                            onChange={(val: any) => {
                                functions.setSportFilterValue(val);
                                getDataWithFilters({ctry: properties.countryFilterValue,
                                                    sports: val,
                                                    date: properties.dateFilterValue,
                                                    name: properties.nameFilterValue
                                },
                                functions.currentPage,
                                functions.maxPage
                                );
                            }}
                            label="Sport"
                            name="sports"
                        />
                        <div className="__board_table_filter_name_filter">
                            <label>Event Name</label>
                            <input
                                type="text"
                                id="board_table_event_name_input"
                                onChange={(event) => {
                                    functions.setNameFilterValue(event.target.value);
                                }}
                                placeholder={"Enter event name"}
                            />
                        </div>
                        <button
                            onClick={() => {
                                getDataWithFilters({ctry: properties.countryFilterValue,
                                                    sports: properties.sportFilterValue,
                                                    date: properties.dateFilterValue,
                                                    name: properties.nameFilterValue
                                },
                                functions.currentPage,
                                functions.maxPage
                                );
                            }}
                        >Search</button>
                        <button
                            onClick={() => {
                                functions.setNameFilterValue("");
                                getDataWithFilters({ctry: properties.countryFilterValue,
                                    sports: properties.sportFilterValue,
                                    date: properties.dateFilterValue,
                                    name: ""
                                },
                                functions.currentPage,
                                functions.maxPage
                                );
                                clearValueInput("board_table_event_name_input");
                            }}
                        >Clear</button>
                        <div className="__board_table_date_sorters">
                            <button
                                value={"asc"}
                                style={{background: properties.dateFilterValue === "asc" ? "#067158" : "#171719"}}
                                onClick={() => {
                                        functions.setDateFilterValue("asc");
                                        getDataWithFilters({ctry: properties.countryFilterValue,
                                            sports: properties.sportFilterValue,
                                            date: "asc",
                                            name: properties.nameFilterValue
                                        },
                                        functions.currentPage,
                                        functions.maxPage
                                        );
                                }}
                            ><BsSortUpAlt size={"80%"}/></button>
                            <button
                                value={"desc"}
                                style={{background:  properties.dateFilterValue === "desc" ? "#067158" : "#171719"}}
                                onClick={() => {
                                        functions.setDateFilterValue("desc");
                                        getDataWithFilters({ctry: properties.countryFilterValue,
                                            sports: properties.sportFilterValue,
                                            date: "desc",
                                            name: properties.nameFilterValue
                                        },
                                        functions.currentPage,
                                        functions.maxPage
                                        );
                                }}
                            ><BsSortDownAlt size={"80%"}/></button>
                        </div>
                    </div>
                </div>
            }
            <div
                className="__board_table"
                style={{width: properties.width, height: properties.height}}
            >
                <div className="__board_table_legend">
                    {legendBar}
                </div>
                <div className="__board_table_data">
                    {
                        !properties.maxPage && properties.maxPage !== 0 ?
                        <div className="__board_table_data_loading">
                            <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
                            <p>Loading Event History...</p>
                        </div> :
                        !properties.currentPageData ? <div className="__board_table_no_data">No races found</div> :
                        properties.currentPageData && properties.currentPageData.map((item: any, index: number) =>
                            <div
                                className="__board_table_data_item"
                                key={`${index}_board_table_data_item`}
                                onClick={() => {
                                    properties.navHistory ?
                                    navigate(`/history/${item.id}`, {
                                        state: {
                                            eventId: item.id,
                                            eventTrack: item.event_track_name,
                                            eventDate: item.event_date
                                        }
                                    })
                                    :
                                    navigate(`/live/${item.token}`);
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
                                            <img
                                                style={
                                                    {width: item_name.customSrc ? "45px" : "35px", height: item_name.customSrc ? "45px" : "26px"}
                                                }
                                                src={item_name.customSrc ? `${item_name.customSrc}${item?.[item_name.data]}.png` : `https://flagcdn.com/${item?.[item_name.data]?.toLowerCase()}.svg`}
                                            /> :
                                            item_name.customElement ? item_name.customElement(item) :
                                            item_name.dataParent ? item?.[item_name.dataParent]?.[item_name.data] : item?.[item_name.data]

                                        }</p>
                                    )
                                }
                            </div>
                        )
                    }
                </div>
            </div>
            {
                properties.maxPage && properties.pageSwitch &&
                <div className="app__historyGroups_pageChange">
                    <button
                        onClick={() => {
                            if (properties.currentPage - 1 !== 0) {
                                functions.currentPage(properties.currentPage - 1);
                                functions.pageData(properties.currentPage - 1);
                            }
                        }}
                    >{`<`}</button>
                    <span>{`${properties.currentPage} / ${properties.maxPage}`}</span>
                    <button
                        onClick={() => {
                            if (properties.currentPage + 1 <= properties.maxPage!) {
                                functions.currentPage(properties.currentPage + 1);
                                functions.pageData(properties.currentPage + 1);
                            }
                        }}
                    >{`>`}</button>
                </div>
            }

        </div>
    );  
};
import React from "react";
import { RiTimerFlashFill } from "react-icons/ri";
import "./components.scss";
import { BsArrowDownShort, BsArrowUpShort, BsFillCircleFill } from "react-icons/bs";


export default class ScoreboardLeaderRow extends React.Component<{data: any}, {showContent: boolean}> {
    constructor(props: any) {
        super(props);
        this.state = {
            showContent: false
        };
    };

    getPositionArrow(positionChange: string, size = 20) {
        if (!positionChange) return;

        switch (positionChange) {
          case "+": return <BsArrowUpShort size={size} color={"#2dcc30"}/>
          case "-": return <BsArrowDownShort size={size} color={"#ff3636"}/>
          case "F": return <img className="finish_flag" src={"/flags/finish_small.png"} alt="-" />
          default:  return <BsFillCircleFill size={10} color={"#FFF"}/>
        }
    };

    transformDataToComponents() {
        const topCompetitors = this.props.data?.competitor?.slice(0, 3); // take top 3

        if (!topCompetitors) { this.state.showContent || this.setState({showContent: false}); return (<></>) }

        const fastestLapDriver = this.props.data?.race_info?.fastest;
        if (!fastestLapDriver) { this.state.showContent || this.setState({showContent: false}); return (<></>) }

        if (!this.state.showContent) {
            this.setState({showContent: true});
        }

        return (
            <div className="scoreboardRow-competitors">
                {
                    topCompetitors.map((item: any, index: number) =>
                        <div className="scoreboardRow-competitor-item" key={`scoreboardRow-item${index}`}>
                            {
                                <div className="scoreboardRow-competitor-col-0">
                                    {index === 0 ? `LEADER` : `${item.gap}`}
                                </div>
                            }
                            <div className="scoreboardRow-competitor-row-1">
                                <div className="scoreboardRow-competitor-col-1-pos">{item.position}</div>
                                <div className="scoreboardRow-competitor-col-1-nr">{item.nr}</div>
                                <div className="scoreboardRow-competitor-col-1-state">
                                    <img src={`https://flagcdn.com/${item.state?.toLowerCase()}.svg`}/>
                                </div>
                            </div>
                            <div className="scoreboardRow-competitor-row-2">
                                <p>{item.firstname}</p>
                                <span>{item.lastname}</span>
                                <div className="scoreboardRow-competitor-row-2-change">
                                    { this.getPositionArrow(item.status) }
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    <div className="scoreboardRow-fastest-item">
                        <div className="scoreboardRow-fastest-col-1">
                            <div className="scoreboardRow-fastest-filler">
                                <RiTimerFlashFill size={"45px"}/>
                            </div>
                        </div>
                        <div className="scoreboardRow-fastest-col-2">
                            <div className="scoreboardRow-fastest-row-1">
                                <div className="scoreboardRow-fastest-row-1-content">
                                    <p>{fastestLapDriver.position}</p>
                                </div>
                                <span>{fastestLapDriver.nr}</span>
                                <div className="scoreboardRow-competitor-row-1-state">
                                    <img src={`https://flagcdn.com/${fastestLapDriver.state?.toLowerCase()}.svg`}/>
                                </div>
                            </div>
                            <div className="scoreboardRow-fastest-row-2">
                                    <p>{fastestLapDriver.firstname}</p>
                                    <span>{fastestLapDriver.lastname}</span>
                                    <div className="scoreboardRow-fastest-row-2-time">
                                        {fastestLapDriver.best_lap_time}
                                    </div>
                            </div>
                        </div>
                    </div>
                }

            </div>
        );
    }

    render() {

        if (!this.state.showContent) {
            if (this.props.data?.competitor) { this.setState({showContent: true}); }
        }

        return (
            <div className="scoreboardRow-main">
                <div className="scoreboardRow-head"><p>RACE TOP 3</p><span>FASTEST LAP</span></div>
                {
                    this.state.showContent &&
                    <div className="scoreboardRow-content">
                        { this.transformDataToComponents() }
                    </div>
                }
                <div className="scoreboardRow-footer" />
            </div>
        );
    }
};
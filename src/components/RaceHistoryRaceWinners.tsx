import React from 'react';
import { BsTrophyFill } from "react-icons/bs";
import { RiTimerFlashFill } from "react-icons/ri";

export default class RaceHistoryRaceWinners extends React.Component <{data: any, mediaQuery: any}, {raceWinner: any, fastestLap: any, raceType: string}> {
    constructor(props: any) {
        super(props);
        this.state = {
            raceWinner: {},
            fastestLap: {},
            raceType: "",
        }
    }
    componentDidUpdate(prevProps: Readonly<{ data: any }>): void {
        if (this.props.data !== prevProps.data) {
            this.parseData(this.props.data);
        }
    }
    parseData(data: any): void {
        if (!data) { return; }
        this.setState({
                raceWinner: data.race_data.winner,
                fastestLap: data.race_data.fastest_lap,
                raceType: data.race_data.race_type
            });
    }
    render() {
        if (!this.state.raceWinner) { return (<></>); }
        return (
            <div
                className={`${this.props.mediaQuery.mobile ?
                    "mobile__historyRace-data-race-winners" : "app__historyRace-data-race-winners"
                }`}
                style={{
                    flexDirection: this.props.mediaQuery.mobile ?
                        !this.props.mediaQuery.split ? "row" : "column"
                    : "row"
                }}
            >
            {
                <div className="app__historyRace-data-winner">
                    <BsTrophyFill color="#ffe608" size={"30px"}/>
                    <p>#{this.state.raceWinner?.nr}</p>
                    <h4>{`${this.state.raceWinner?.firstname?.charAt(0)}. ${this.state.raceWinner?.lastname}`}</h4>
                    <p>{this.state.raceWinner?.class}</p>
                </div>
            }
            {
                this.state.raceType === "Race" &&
                <div className="app__historyRace-data-fastest-lap">
                    <RiTimerFlashFill size={"32px"}/>
                    <p>#{this.state.fastestLap?.nr}</p>
                    <h4>{`${this.state.fastestLap?.firstname?.charAt(0)}. ${this.state.fastestLap?.lastname}`}</h4>
                    <span>{this.state.fastestLap?.best_lap_time}</span>
                </div>
            }
            </div>
        );
    }
};
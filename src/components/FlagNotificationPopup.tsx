import React from "react";
import "./components.scss";


export default class FlagNotificationPopup extends React.Component<{data: any}, {currentFlag: string, isVisible: boolean}> {

    lastFlag: string = "";

    constructor(props: any) {
        super(props);
        this.state = {
            currentFlag: this.props.data || this.lastFlag,
            isVisible: false
        };
    }
    flagToColor(flag: string): string {
        switch (flag) {
            case "Unknown": return "azure";
            case "Green":   return "#47ba79";
            case "Yellow":  return "#f7e705";
            case "Red":     return "#ed4747";
            case "Finish":  return "azure";
            case "WarmUp":  return "#b205f7";
            default: return "azure";
        };
    };
    componentDidUpdate(prevProps: Readonly<{ data: any; }>): void {
        if (this.props.data !== prevProps.data) {
            this.setState({currentFlag: this.props.data, isVisible: true});
            // Hide notification after 5 seconds
            setTimeout(() => {
                this.setState({isVisible: false});
            }, 5000);
        }
    }
    render() {
        return (
            <div
                className={`flagPopup-main ${this.state.isVisible ? "visible" : "hidden"}`}
                style={{
                    color: this.state.currentFlag ? this.flagToColor(this.state.currentFlag) : "azure"
                }}
            >
                <p>{this.state.currentFlag !== "Unknown" ? `${this.state.currentFlag} Flag` : "Race Ended"}</p>
            </div>
        );
    }
}
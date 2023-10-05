import React from "react";

class Button extends React.Component {
    getClassName() {
        return `btn_class_${this.props.className}`;
    }
    getButtonContent() {
        return "";
    }
    render() {
        return (
            <button className={this.getClassName()}>
                {this.getButtonContent()}
            </button>
        );
    }
}

export default Button;
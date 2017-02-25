import React from "react";
import SideNav from "./sideNav.jsx";

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.handleCollapseSideNav = this.handleCollapseSideNav.bind(this);
        this._getSideNavClassName = this._getSideNavClassName.bind(this);
        this._getBurgerClassName = this._getBurgerClassName.bind(this);
        this.state = {
            sideNavCollapsed: true
        };
    }

    handleCollapseSideNav() {
        this.setState({
            sideNavCollapsed: !this.state.sideNavCollapsed
        });
    }
    _getSideNavClassName() {
        return this.state.sideNavCollapsed ? "sideNav collapsed" : "sideNav";
    }
    _getBurgerClassName() {
        return this.state.sideNavCollapsed ? "burger" : "burger active";
    }

    render() {
        //console.log("header", this.props);
        return (
            <header>
                <div className="nav">
                    <a
                        className="logo"
                        href="/"
                    >
                        Harley weather
                    </a>
                    <a
                        className={this._getBurgerClassName()}
                        href="#"
                        onClick={this.handleCollapseSideNav}
                    >
                        <span></span>
                    </a>
                </div>
                <div className={this._getSideNavClassName()}></div>
                <SideNav
                    authError={this.props.authError}
                    chartState={this.props.chartState}
                    className={this._getSideNavClassName()}
                    userName={this.props.userName}
                    userPassword={this.props.userPassword}
                />
            </header>
        );
    }
}

Header.propTypes = {
    chartState: React.PropTypes.object,
    authError: React.PropTypes.object,
    userName: React.PropTypes.string,
    userPassword: React.PropTypes.string
};
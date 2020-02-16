import React, {Component} from 'react';
import { NavLink } from 'react-router-dom';
import * as Feather from 'react-feather';
import NavBadge from './NavBadge';
import {connect} from "react-redux";
import {setActiveLinkSidebar} from "../../../thunks/sidebar";
import {withRouter} from 'react-router-dom';
import {isEmpty} from "../../../thunks/utils";

class NavSingleItem extends Component {
    constructor(props) {
        super(props);
    }

    setActive(e) {
        e.preventDefault();
        this.props.setActiveLink(this.props.item.url);
        this.props.history.push(this.props.item.url);
    }

    setBadge() {
        if (typeof this.props.item.badge !== 'undefined' && !isEmpty(this.props.item.badge))
            return (<NavBadge color={this.props.item.badge.variant} text={this.props.item.badge.text}/>);
        return (null);
    }

    render() {
        const Icon = this.props.item.icon && Feather[this.props.item.icon] ? Feather[this.props.item.icon] : null;
        if (this.props.item.external) {
            const rel = this.props.item.target && this.props.item.target === '_blank' ? 'noopener noreferrer' : null;
            return (
                <li className="nav-item">
                    <a href={this.props.item.url} target={this.props.item.target} rel={rel} onClick={this.setActive.bind(this)}>
                        {this.props.item.icon && Icon && <Icon className="side-nav-icon"/>}
                        <span className="nav-this.props.item-label">{this.props.item.name}</span>
                        { this.setBadge() }
                    </a>
                </li>
            );
        } else {
            const url = this.props.item.url.charAt(0) === '/' ? this.props.item.url : `/${this.props.item.url}`;
            return (
                <li className="nav-item">
                    <NavLink exact to={url} className={this.props.item.active ? 'active' : ''} onClick={this.setActive.bind(this)}>
                        {this.props.item.icon && Icon && <Icon className="side-nav-icon"/>}
                        <span className="nav-item-label">{this.props.item.name}</span>
                        { this.setBadge() }
                    </NavLink>
                </li>
            );
        }
    }
}

const mapStateToProps = state => ({
    ready: state.app.system.ready
});

const mapDispatchToProps = dispatch => ({
    setActiveLink: (href) => dispatch(setActiveLinkSidebar(href)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavSingleItem));
// Example usage: <NavSingleItem />

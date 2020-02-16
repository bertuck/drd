import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'reactstrap';
import NavSpacer from './components/NavSpacer';
import NavOverlay from './components/NavOverlay';
import NavDivider from './components/NavDivider';
import NavSingleItem from './components/NavSingleItem';
import NavDropdownItem from './components/NavDropdownItem';

class Navigation extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const navItems = items => {
            return Object.values(items).map((item, index) => itemType(item, index));
        };
        const itemType = (item, index) => {
            if (item.children) {
                return <NavDropdownItem key={index} item={item} isSidebarCollapsed={this.props.isSidebarCollapsed} />;
            } else if (item.divider) {
                return <NavDivider key={index} />;
            } else {
                return <NavSingleItem item={item} key={index} />;
            }
        };
        const NavBrand = ({ logo, logoText }) => {
            return (
                <div className="site-logo-bar">
                    <NavLink to="/" className="navbar-brand">
                        {logo && <img src={logo} alt="" />}
                        {logoText && <span className="logo-text">{logoText}</span>}
                    </NavLink>
                </div>
            );
        };

        return (
            <div>
                <div className={`app-sidebar`}>
                    <NavBrand logo={this.props.logo} logoText={this.props.name}/>
                    <nav>
                        <ul id="main-menu">
                            {navItems(this.props.navigation)}
                            <NavSpacer/>
                        </ul>
                    </nav>
                </div>
                {this.props.isSidebarCollapsed && <NavOverlay/>}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    logo: state.app.system.logo,
    ready: state.app.system.ready,
    navigation: state.app.navigation_sidebar,
    name: state.app.system.name,
    isSidebarCollapsed: state.app.system.sidebar_is_collapsed
});

export default connect(mapStateToProps)(Navigation);
// Example usage: <Sidebar />

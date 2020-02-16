import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Navbar, NavbarToggler, Collapse, NavItem, NavLink } from 'reactstrap';
import ToggleSidebarButton from './components/ToggleSidebarButton';

class Navigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
        };

    }

    toggle(isOpen) {
        this.setState({
            isOpen: !isOpen
        });
    };
    account() {
        if (this.props.user.uid !== '0')
            return (
                <div className="account"><a type="button" className="btn btn-danger" href={"/user/logout?destination=/dashboard"}>Se deconnecter</a></div>
            );
        return (
            <div className="account"><a type="button" className="btn btn-success" href={"/user/login?destination=/dashboard"}>Se connecter</a></div>
        );
    }

    render() {
        return (
            <header className="app-header">
                <SkipToContentLink focusId="primary-content" />
                <div className="top-nav">
                    <Navbar color="faded" light expand="md">
                        <ToggleSidebarButton />
                        <div className="page-heading">{this.props.page_title}</div>
                        { this.account() }
                        <NavbarToggler onClick={this.toggle.bind(this, this.isOpen)} />
                    </Navbar>
                </div>
            </header>
        );
    }
}

const SkipToContentLink = ({ focusId }) => {
    return (
        <a href={`#${focusId}`} tabIndex="1" className="skip-to-content">
            Skip to Content
        </a>
    );
};

const mapStateToProps = state => ({
    ready: state.app.system.ready,
    user: state.drupal.user,
    page_title: state.app.system.page_title,
    navigation: state.app.navigation_top,
    name: state.app.system.name,
    isSidebarCollapsed: state.app.system.sidebar_is_collapsed
});


export default connect(mapStateToProps)(Navigation);
// Example usage: <Navigation />

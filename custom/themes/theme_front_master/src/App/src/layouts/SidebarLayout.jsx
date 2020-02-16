import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Notifications, Loading, Navigation, Sidebar } from "../components";
import { initApp } from "../thunks/general";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import routes from "../views";
import ErrorPage from "../views/pages/404";

class SidebarLayout extends Component {
    constructor(props) {
        super(props);
        this.props.initApp(this.props.drupal);
    }

    render() {
        const sidebarCollapsedClass = this.props.isSidebarCollapsed ? 'side-menu-collapsed' : '';
        return (
            <BrowserRouter basename="/dashboard">
                <div className={`app ${sidebarCollapsedClass}`}>
                    <div className="app-body">
                        <Sidebar/>
                        <div id="page-content" className="">
                            <Navigation/>
                            <main id="primary-content" tabIndex="-1" role="main">
                                <Notifications />
                                <Switch>
                                    {routes.map((page, key) => (
                                        <Route path={page.path} component={page.component} key={key} />
                                    ))}
                                    <Redirect from="/" to="/home" />
                                    <Route component={() => <ErrorPage/>} />
                                </Switch>
                                <Loading/>
                            </main>
                        </div>
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}

const mapStateToProps = state => ({
    ready: state.app.system.ready,
    isSidebarCollapsed: state.app.system.sidebar_is_collapsed
});

const mapDispatchToProps = dispatch => ({
    initApp: (drupal) => dispatch(initApp(drupal))
});

export default connect(mapStateToProps, mapDispatchToProps)(SidebarLayout);
// Example usage: <SidebarLayout />

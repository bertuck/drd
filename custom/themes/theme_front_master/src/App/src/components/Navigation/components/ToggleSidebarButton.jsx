import React, {Component} from 'react';
import { Button } from 'reactstrap';
import FA from 'react-fontawesome';
import {connect} from "react-redux";
import {toggleSidebar} from "../../../thunks/sidebar";

class ToggleSidebarButton extends Component {
    render() {
        const chevronClassName = this.props.isSidebarCollapsed ? 'is-collapsed' : 'is-not-collapsed';
        const screenReaderLabel = this.props.isSidebarCollapsed ? 'Expand Sidebar Navigation' : 'Collapse Sidebar Navigation';
        return (
            <Button onClick={this.props.toggleSidebar} className={`m-r sidebar-toggle ${chevronClassName}`}
                    aria-label={screenReaderLabel}>
                <FA name={'chevron-left'}/>
            </Button>
        );
    }
}

const mapStateToProps = state => ({
    isSidebarCollapsed: state.app.system.sidebar_is_collapsed
});


const mapDispatchToProps = dispatch => ({
    toggleSidebar: () => dispatch(toggleSidebar())
});

export default connect(mapStateToProps, mapDispatchToProps)(ToggleSidebarButton);

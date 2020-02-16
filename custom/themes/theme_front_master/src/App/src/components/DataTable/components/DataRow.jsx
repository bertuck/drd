import React, {Component} from 'react';
import {connect} from "react-redux";
import {Button} from "reactstrap";
import {deleteFlag, setFlag} from "../../../thunks/apiDrupal";
import {setCurrentRandomPage} from "../../../thunks/general";
import {setActiveLinkSidebar} from "../../../thunks/sidebar";

import {withRouter} from "react-router-dom";

class DataRow extends Component {
    constructor(props) {
        super(props);
    }

    unFlagged(nid, e) {
        this.props.deleteFlag(nid);
    }

    flagged(nid, e) {
        this.props.setFlag(nid);
    }

    routeChange(nid) {
        this.props.setCurrentRandomPage(nid);
        let path = '/random';
        this.props.setActiveLinkSidebar('/dashboard/random');
        this.props.history.push(path);
    }

    render() {
        return (
            <tr>
                { Object.values(this.props.items).map((item, index) => {
                        switch (item.type) {
                            case 'text':
                                return (<td key={index}>{item.content}</td>);
                            case 'link':
                                return (<td key={index}><Button onClick={this.routeChange.bind(this, item.link)}  size="sm" color="info">Voir</Button></td>);
                            case 'unflag':
                                return (<td key={index}><Button onClick={this.unFlagged.bind(this, item.content)} size="sm" color="danger">Supprimer</Button></td>);
                            case 'flag':
                                return (<td key={index}><Button onClick={this.flagged.bind(this, item.content)}  size="sm" color="success">Ajouter</Button></td>);
                            default:
                                return (<td key={index}>{item.content}</td>);
                        }
                    }
                )}
            </tr>
        );
    }
}


const mapStateToProps = state => ({
    ready: state.app.system.ready
});

const mapDispatchToProps = dispatch => ({
    deleteFlag: (nid) => dispatch(deleteFlag(nid)),
    setFlag: (nid) => dispatch(setFlag(nid)),
    setCurrentRandomPage: (nid) => dispatch(setCurrentRandomPage(nid)),
    setActiveLinkSidebar: (path) => dispatch(setActiveLinkSidebar(path))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DataRow));
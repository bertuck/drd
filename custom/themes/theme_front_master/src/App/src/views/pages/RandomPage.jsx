import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Col, Row, NavLink } from "reactstrap";
import {initPage, pageReady, pushNotification, notReady} from "../../thunks/general";
import SanitizedHTML from 'react-sanitized-html';
import ContentLoader from "react-content-loader";


class RandomPage extends Component {
    constructor(props) {
        super(props);
        this.props.initPage("Page");
        this.state = {
            nid: this.props.currentRandomPage,
            response: '',
        };
    }

    componentDidMount() {
        this.props.pageReady();
        this.componentPage();
    }

    notFound() {
        return (
            <Container>
                <Row>
                    <Col md={12}>
                        <div className="m-t-xxl text-center">
                            <h1 className="error-number">404</h1>
                            <h3 className="m-b">Sorry but we couldnt find this node with nid : {this.state.nid}. It doesn't exist!</h3>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }

    componentPage() {
        fetch('/api/page/'+this.state.nid)
            .then(response => response.text())
            .then(response => {
                if (response !== null && response !== '')
                    this.setState( {...this.state, response : response});
                else {
                    this.props.notReady();
                    this.setState( {...this.state, response : this.notFound()});
                    this.props.pushNotification({title: 'Error', text : "Node nid " + this.state.nid + " not found.", type: "danger"});
                }

            })
            .catch(() => {
                this.props.pushNotification({title: 'Error', text : "Reading data /api/page", type: "danger"});
            })
    }

    render() {
        if (this.props.ready)
            return (
                <Container>
                    <Row>
                        <Col md={12}>
                            <div dangerouslySetInnerHTML={{ __html: this.state.response }} />
                        </Col>
                    </Row>
                </Container>
            );
        return this.notFound();
    }
}

const mapStateToProps = state => ({
    ready: state.app.system.ready,
    currentRandomPage: state.app.system.current_random_page
});

const mapDispatchToProps = dispatch => ({
    initPage: (page_title) => dispatch(initPage(page_title)),
    pageReady: () => dispatch(pageReady()),
    notReady: () => dispatch(notReady()),
    pushNotification: (notif) => dispatch(pushNotification(notif))
});

export default connect(mapStateToProps ,mapDispatchToProps )(RandomPage);
// Example usage: <BlankPage />

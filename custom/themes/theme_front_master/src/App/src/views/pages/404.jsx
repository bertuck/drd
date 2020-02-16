import React, { Component } from 'react';
import { Container, Row, NavLink } from "reactstrap";
import { connect } from 'react-redux';
import {initPage, pageReady} from "../../thunks/general";

class ErrorPage extends Component {
    constructor(props) {
        super(props);
        this.props.initPage("Error Page");
    }

    componentDidMount() {
        this.props.pageReady();
    }

    render() {
        if (this.props.ready)
            return (
                <Container>
                    <Row>
                        <div className="m-t-xxl text-center">
                            <h1 className="error-number">404</h1>
                            <h3 className="m-b">Sorry but we couldnt find this page. It doesn't exist!</h3>
                            <NavLink to={'/home'}>Go Home!</NavLink>
                        </div>
                    </Row>
                </Container>
            );
        return null;
    }
}

const mapStateToProps = state => ({
    ready: state.app.system.ready
});

const mapDispatchToProps = dispatch => ({
    initPage: (page_title) => dispatch(initPage(page_title)),
    pageReady: () => dispatch(pageReady())
});


export default connect(mapStateToProps, mapDispatchToProps)(ErrorPage);
// Example usage: <ErrorPage />

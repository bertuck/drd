import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';
import ContentLoader from 'react-content-loader'

class LoadingDatatable extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <ContentLoader
                speed={1}
                width={400}
                height={160}
                viewBox="0 0 400 160"
                backgroundColor="#7a7a7a"
                foregroundColor="#ecebeb"
            >
                <circle cx="10" cy="20" r="8" />
                <rect x="25" y="15" rx="5" ry="5" width="220" height="10" />
                <circle cx="10" cy="50" r="8" />
                <rect x="25" y="45" rx="5" ry="5" width="220" height="10" />
                <circle cx="10" cy="80" r="8" />
                <rect x="25" y="75" rx="5" ry="5" width="220" height="10" />
                <circle cx="10" cy="110" r="8" />
                <rect x="25" y="105" rx="5" ry="5" width="220" height="10" />
            </ContentLoader>
        );
    }
}

const mapStateToProps = state => ({
    ready: state.app.system.ready,
});


export default connect(mapStateToProps)(LoadingDatatable);
// Example usage: <LoadingDatatable />

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';
import ContentLoader from 'react-content-loader'

class Loading extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        if (!this.props.ready)
            return (
                <div id="spinner" className="container-loading">
                    <ContentLoader
                        viewBox="0 0 400 160"
                        height={160}
                        width={400}
                        speed={2}
                        backgroundColor="transparent"
                    >
                        <circle cx="150" cy="86" r="8" />
                        <circle cx="194" cy="86" r="8" />
                        <circle cx="238" cy="86" r="8" />
                    </ContentLoader>
                </div>
            );
        return (null);
    }
}

const mapStateToProps = state => ({
    ready: state.app.system.ready,
});


export default connect(mapStateToProps)(Loading);
// Example usage: <Page />

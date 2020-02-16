import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactWeather from "./components/ReactWeather";

class Weather extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <ReactWeather
                forecast={this.props.options.forecast}
                apikey={this.props.options.api_key}
                type="city"
                city={this.props.options.city}/>
        );
    }
}

const mapStateToProps = state => ({
    options: state.weather,
});


export default connect(mapStateToProps)(Weather);
// Example usage: <Page />



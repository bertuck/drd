import React from 'react';
import ApiOpenWeather from '../../../thunks/apiOpenWeather';
import { getIcon } from '../../../thunks/utils';
import TodayForecast from './TodayForecast';
import DaysForecast from './DaysForecast';
import WeatherIcon from './WeatherIcon';
import {connect} from "react-redux";

class ReactWeather extends React.Component {

  constructor(props) {
    super(props);
    this.api = new ApiOpenWeather(this.props.unit, this.props.apikey, this.props.lang);
    this.state = {
      data: null,
    };
  }
  render() {
    const { unit, forecast, lang } = this.props;
    const data = this.state.data;
    if (data) {
      const days = data.days;
      const today = data.current;
      const todayIcon = getIcon(today.icon);
      return (
        <div className="rw-box">
          <div className={`rw-main type-${forecast}`}>
            <div className="rw-box-left">
              <h2>{data.location.name}</h2>
              <TodayForecast todayData={today} unit={unit} lang={lang} />
            </div>
            <div className="rw-box-right">
              <WeatherIcon name={todayIcon} />
            </div>
          </div>
          <DaysForecast
            unit={unit}
            forecast={forecast}
            daysData={days}
            lang={lang}
          />
        </div>
      );
    }
    return (null);
  }
  componentDidMount() {
    this.getForecastData();
  }
  componentWillUnmount() {
    this.setState = () =>{ return; };
  }
  getForecastData() {
    const self = this;
    const params = self._getParams();
    let promise = null;
    promise = self.api.getForecast(params);
    promise.then(data => {
      self.setState({
        data,
      });
    });
  }
  _getParams() {
    const { type, lon, lat, city, lang } = this.props;
    switch (type) {
      case 'city':
        return { q: city, lang };
      case 'geo':
        return {
          lat,
          lon,
          lang,
        };
      default:
        return {
          q: 'auto:ip',
          lang,
        };
    }
  }
}

const mapStateToProps = state => ({
  unit: state.weather.unit,
  type: state.weather.type,
  lat: state.weather.lat,
  lon: state.weather.lon,
  city: state.weather.city,
  forecast: state.weather.forecast,
  apikey: state.weather.api_key,
  lang: state.weather.lang,
});

export default connect(mapStateToProps)(ReactWeather);
// Example usage: <Page />

import React from 'react';
import { getIcon } from '../../../thunks/utils';
import WeatherIcon from './WeatherIcon';

const DaysForecast = ({ forecast, unit, daysData }) => {
  if (forecast === '5days') {
    const units = utils.getUnits(unit);
    return (
      <div className="rw-box-days">
        {
          daysData.map((day, i) => {
            if (i >= 0) {
              const iconCls = getIcon(day.icon);
              return (
                <div key={`day-${i}`} className='rw-day'>
                  <div className="rw-date">{day.date}</div>
                  <WeatherIcon name={iconCls} />
                  <div className="rw-desc">{day.description}</div>
                  <div className="rw-range">{day.temperature.max} / {day.temperature.min} {units.temp}</div>
                </div>
              );
            }
            return '';
          })
        }
      </div>
    );
  }
  return (<div></div>);
};

export default DaysForecast;

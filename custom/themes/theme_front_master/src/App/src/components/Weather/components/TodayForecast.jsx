import React from 'react';
import { getIcon, getUnits, getLangs } from '../../../thunks/utils';

const TodayForecast = ({ todayData, unit, lang }) => {
  const todayIcon = getIcon(todayData.icon);
  const units = getUnits(unit);
  const langs = getLangs(lang);
  return (
    <div className="rw-today">
      <div className="date">{todayData.date}</div>
      <div className="hr"></div>
      <div className="current">{todayData.temperature.current} {units.temp}</div>
      <div className="range">{todayData.temperature.max} / {todayData.temperature.min} {units.temp}</div>
      <div className="desc">
        <i className={`wicon wi ${todayIcon}`}></i>
        &nbsp;{todayData.description}
      </div>
      <div className="hr"></div>
      <div className="info">
        <div>{langs.Wind}: <b>{todayData.wind}</b> {units.speed}</div>
        <div>{langs.Humidity}: <b>{todayData.humidity}</b> %</div>
      </div>
    </div>
  );
};

export default TodayForecast;

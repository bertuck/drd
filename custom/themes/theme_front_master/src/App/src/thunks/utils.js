import moment from 'moment';
import 'moment/locale/fr';
import { icons } from './icons';
import { langText } from './lang';

export const getIcon = (icon) => {
  if (!icon) {
    return 'na';
  }
  const icoClass = icons[icon];
  if (icoClass) {
    return icoClass;
  }
  return 'na';
};

export const toggleSidebar = (icon) => {
  if (!icon) {
    return 'na';
  }
  const icoClass = icons[icon];
  if (icoClass) {
    return icoClass;
  }
  return 'na';
};

export const isEmpty = (obj) => {
  if (obj == null) return true;
  if (obj.length > 0)    return false;
  if (obj.length === 0)  return true;
  if (typeof obj !== "object") return true;
  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) return false;
  }
  return true;
};

export const getUnits = (unit) => {
  if (unit === 'metric') {
    return {
      temp: '°C',
      speed: 'km/h',
    };
  } else if (unit === 'imperial') {
    return {
      temp: '°F',
      speed: 'mph',
    };
  }
  return { temp: '', speed: '' };
};

export const formatDate = (dte, lang)  => {
  if (dte && moment(dte).isValid()) {
    moment.locale(lang)
    return moment.unix(dte).format('ddd D MMMM');
  }
  return '';
};

export const getLangs = (lang) => {
  return langText[lang] === undefined ? langText.en : langText[lang];
};

export const getNextDays = (tomorrow) => {  // Returns an array containing the next 4 days dates in format yyyy-mm-dd

  let fourDates = [];
  let tomorrow_formated = "";

  // Creating the 4 dates in the good format
  for(let i=0; i<4; i++) {
    tomorrow.setDate(tomorrow.getDate() + 1);
    const month = tomorrow.toLocaleString('default', { month: '2-digit' });
    tomorrow_formated = tomorrow.getFullYear() + "-" + month + "-" + ("0" + tomorrow.getDate()).slice(-2);
    fourDates.push(tomorrow_formated);
  }

  return fourDates;
};

export const filterData = (data, predicate) => {
  return !!!data ? null : data.reduce((parentlist, parententry, currentParentIndex) => {
    !!!data ? null : parententry.reduce((list, entry) => {
      let clone = null;
      if (predicate(entry))
        clone = data[currentParentIndex];
      if (!containsObject(clone, parentlist))
        clone && parentlist.push(clone);
      return parentlist;
    }, []);
    return parentlist;
  }, []).filter((el) => el.length > 0);
};

export const containsObject = (obj, list) => {
  for (let i = 0; i < list.length; i++)
    if (list[i] === obj) return true;
  return false;
};
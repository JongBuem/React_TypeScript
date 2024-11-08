import moment from 'moment';

export const setCookie = (name, value, expiresOn) => {
  let date = new Date();
  const diff = moment(expiresOn).diff(date, 'milliseconds');
  date.setTime(date.getTime() + diff);
  document.cookie =
    name +
    '=' +
    value +
    ';expires=' +
    date.toUTCString() +
    ';path=/' +
    ';secure';
};

export const getCookie = (name) => {
  const value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return value ? value[2] : null;
};

export const deleteCookie = (name) => {
  document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
};

import moment from 'moment';
import { nullAddress } from './constants/variables';

export const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

export const shortAddress = (address) => {
  if (address == null) return nullAddress;
  const firstPart = address.substring(0, 6);
  const secondPart = address.slice(-4);
  return firstPart + '...' + secondPart;
};

export const getDuration = (startDate, endDate) => {
  const startDateUnix = moment.utc(startDate).unix();
  const endDateUnix = moment.utc(endDate).unix();
  return (endDateUnix - startDateUnix).toString();
};

export const getExtension = (name) => {
  return name.match(/\.([^.]+)$/)?.[1];
};

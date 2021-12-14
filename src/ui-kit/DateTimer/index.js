import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import TokenDetailTimer from './token_details_timer';
import TokenMarketplaceTimer from './token_marketplace_timer';

const DateTimer = ({ startDate, endDate, seconds = true, cb = null }) => {
  const startDateMoment = moment(moment.unix(startDate).toDate());
  const endDateMoment = moment(moment.unix(endDate).toDate());
  const isSellingStart = moment() > startDateMoment;
  const isSellingFinished = moment() < endDateMoment;

  const calculateTimeLeft = () => {
    const difference = isSellingStart ? endDateMoment - moment() : startDateMoment - moment();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        d: Math.floor(difference / (1000 * 60 * 60 * 24)),
        h: Math.floor((difference / (1000 * 60 * 60)) % 24),
        m: Math.floor((difference / 1000 / 60) % 60),
        // s: Math.floor((difference / 1000) % 60),
      };

      if (seconds) {
        timeLeft = { ...timeLeft, s: Math.floor((difference / 1000) % 60) };
      }
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timeoutID = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
      if (moment() > endDateMoment && cb) cb();
    }, 1000);
    return () => window.clearTimeout(timeoutID);
  });

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    // if need to hide when equal zero
    // if (!timeLeft[interval]) {
    //   return;
    // }

    timerComponents.push(
      <span key={uuidv4()}>
        {timeLeft[interval]}
        {interval}{' '}
      </span>
    );
  });

  return (
    <>
      {seconds && isSellingFinished && (
        <TokenDetailTimer isSellingStart={isSellingStart} timerComponents={timerComponents} />
      )}
      {!seconds && isSellingFinished && <TokenMarketplaceTimer timerComponents={timerComponents} />}
    </>
  );
};

export default DateTimer;

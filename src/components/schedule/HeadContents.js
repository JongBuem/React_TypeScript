import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

function HeadContents() {
  console.log('head');
  const [nextSchedule, setNextSchedule] = React.useState('');
  const [nextScheduleUnit, setNextScheduleUnit] = React.useState('');

  const GetNextSchedule = React.useCallback(() => {
    const result = new Date();
    setNextSchedule(moment(result).format('YYYY-MM-DD HH:mm'));
    setNextScheduleUnit(moment(result).format('a'));
  });

  React.useEffect(() => {
    GetNextSchedule();
  }, []);

  return (
    <div className="contents-head">
      <div className="inner">
        <h2 className="page-title">Schedule</h2>
        <div className="head-info-wrap">
          <div className="head-st-wrap">
            <div className="head-st-item">
              <p className="head-st-label">Next</p>
              <div className="head-st-count">
                <span className="total">
                  {nextSchedule}{' '}
                  <span className="ft-400 h3">{nextScheduleUnit}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
HeadContents.propTypes = {
  nextSchedule: PropTypes.string,
  nextScheduleUnit: PropTypes.string,
};
export default React.memo(HeadContents);

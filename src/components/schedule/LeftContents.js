import React from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { scheduleListStore } from 'global/schedule';
import SimpleBar from 'simplebar-react';
import {
  SCHEDULE_KEY_ID,
  SCHEDULE_KEY_NAME,
  SCHEDULE_KEY_STATE,
} from 'common/constants/schedule.constant';

export const LeftScheduleList = React.memo(function LeftScheduleList({ info }) {
  const { id } = useParams();
  const _id = info[SCHEDULE_KEY_ID];
  const name = info[SCHEDULE_KEY_NAME];
  const state = info[SCHEDULE_KEY_STATE];

  const Selected = (arg) => {
    if (id == arg) return true;
    else return false;
  };
  return (
    <li style={{ padding: 0 }} className={clsx({ selected: Selected(_id) })}>
      <Link to={`/schedule/info/${_id}`}>
        <div className="dp-flex" style={{ padding: '16px 15px' }}>
          <div className="mr-auto">
            <div className="dp-flex">
              <div className="st-wrap">
                <span
                  className={clsx('st', {
                    available: state,
                  })}
                ></span>
              </div>
              <h5
                style={Selected(_id) ? { color: '#111' } : { color: '#707070' }}
              >
                {name}
              </h5>
            </div>
          </div>
          <div className="ml-auto">
            <i className="icon-arrow-right ft-lightgray"></i>
          </div>
        </div>
      </Link>
    </li>
  );
});

LeftScheduleList.propTypes = {
  info: PropTypes.object,
};

function LeftContents() {
  console.log('Left');
  const { scheduleList } = scheduleListStore();
  return (
    <div className="area-main">
      <div
        className="inner"
        data-simplebar
        style={{ paddingRight: 0, maxHeight: '800px' }}
      >
        <div className="dp-flex" style={{ paddingRight: '20px' }}>
          <div className="mr-auto">
            <h5>예약목록</h5>
          </div>
          <div className="ml-auto">
            <div className="btn-wrap">
              <Link className="btn btn-outline" to={'/schedule/new'}>
                생성
              </Link>
            </div>
          </div>
        </div>
        <div className="space-20"></div>
        {scheduleList?.length > 0 ? (
          <SimpleBar style={{ maxHeight: '780px' }}>
            <div className="list-wrap hover" style={{ maxHeight: '780px' }}>
              <ul style={{ paddingRight: '20px' }}>
                {scheduleList.map((value) => (
                  <LeftScheduleList key={value[SCHEDULE_KEY_ID]} info={value} />
                ))}
              </ul>
            </div>
          </SimpleBar>
        ) : (
          <div className="not-found">
            <h5>예약이 없습니다.</h5>
          </div>
        )}
      </div>
    </div>
  );
}

LeftContents.propTypes = {
  schedule: PropTypes.array,
};
export default React.memo(LeftContents);

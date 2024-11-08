import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { GetHost } from 'pages/monitoring';
import { ScheduleHostLogDATA } from 'common/class/log';
import { ScheduleHostDATA } from 'common/class/schedule';
import { NumericFormat } from 'react-number-format';
import { systemcodeStore } from 'global/systemcode';
import {
  loadingStore,
  titleStore,
  statusStore,
  subscriptionStore,
  dateStore,
  repeatedStore,
  hostStore,
} from 'global/newSchedule';
import { getAPI } from 'common/api/CmwApi';
import Paging, { usePagination } from 'components/item/Paging';
import {
  scheduleListStore,
  scheduleHostLogStore,
  scheduleLogStore,
} from 'global/schedule';
import { customerStore } from 'global/customer';
import {
  LOG_KEY_ACTION,
  LOG_KEY_STATUS,
  LOG_KEY_JOBCOUNT,
  LOG_KEY_HOSTINFO,
  LOG_KEY_CREATEDAT,
  LOG_KEY_DESCRIPTION,
  LOG_HOST_KEY_SKU,
  LOG_HOST_KEY_LOCATION,
  LOG_HOST_KEY_OLDNAME,
  LOG_HOST_KEY_NEWNAME,
} from 'common/constants/log.constant';
import {
  MONITORING_HOST_KEY_NAME,
  MONITORING_HOST_KEY_SKU,
  MONITORING_HOST_KEY_SKU_LOCATION,
  MONITORING_HOST_KEY_STATUSES,
} from 'common/constants/monitoring.constant';
import {
  SCHEDULE_KEY_NAME,
  SCHEDULE_KEY_SUBSID,
  SCHEDULE_KEY_STATE,
  SCHEDULE_KEY_TARGETHOSTLIST,
  SCHEDULE_KEY_STARTDATETIME,
  SCHEDULE_KEY_SCHEDULETYPE,
  SCHEDULE_KEY_REPEATCYCLEMONTH,
  SCHEDULE_KEY_REPEATCYCLEWEEK,
  SCHEDULE_KEY_REPEATCYCLEDAY,
} from 'common/constants/schedule.constant';
import { GetScheduleLog, GetSchedule } from 'pages/schedule';

export const ScheduleLogItem = React.memo(function ScheduleLogItem({ item }) {
  const { systemcode } = systemcodeStore();

  const findAction = (value) => {
    const result = systemcode.find((v) => v?.codeValue === value);
    return result?.description ?? '';
  };

  const result = {
    jobCount: item[LOG_KEY_JOBCOUNT] ? item[LOG_KEY_JOBCOUNT] + '회' : '',
    action: item[LOG_KEY_ACTION] ?? '',
    status: item[LOG_KEY_STATUS] ?? '',
    description: item[LOG_KEY_DESCRIPTION] ?? '',
    createdAt: item[LOG_KEY_CREATEDAT]
      ? moment(item[LOG_KEY_CREATEDAT]).format('YYYY-MM-DD hh:mm a')
      : '',
  };

  return (
    <tr>
      <td className="align-center">{result.jobCount}</td>
      <td className="align-center">{findAction(result.action)}</td>
      {/* <td className="align-center">{result.action}</td> */}
      {/* <td className="align-left">
        <ul>
          <li className="bullet ft-small">{result.description}</li>
        </ul>
      </td> */}
      <td className="align-center">{result.status}</td>
      <td className="align-center">{result.createdAt}</td>
    </tr>
  );
});

export const ScheduleLog = React.memo(function ScheduleLog({ id }) {
  const { customer } = customerStore();
  const { setScheduleLog, scheduleLog, jobCount, action, status } =
    scheduleLogStore();
  const { data, isLoading, isError } = GetScheduleLog(customer.tenantId, id, {
    refreshInterval: 5000,
  });
  const [log, setLog] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [viewItem] = React.useState(10);
  const count = Math.ceil(log?.length / viewItem);
  const _DATA = usePagination(log, viewItem);
  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  React.useEffect(() => {
    handleChange('', 1);
  }, [count]);

  React.useEffect(() => {
    if (isError) {
      setLog([]);
      setScheduleLog([]);
    } else if (!isLoading && !isError) {
      setLog(data?.data?.items);
      setScheduleLog(data?.data?.items);
    }
  }, [data, isLoading, isError]);

  React.useEffect(() => {
    const jobCountCheck = (v) => {
      if (v[LOG_KEY_JOBCOUNT] == jobCount) return true;
      else return false;
    };
    const actionCheck = (v) => {
      if (v[LOG_KEY_ACTION] === action) return true;
      else return false;
    };
    const statusCheck = (v) => {
      if (v[LOG_KEY_STATUS] === status) return true;
      else return false;
    };

    if (scheduleLog?.length > 0) {
      if (jobCount === 'all' && action === 'all' && status === 'all')
        setLog(scheduleLog);
      else if (jobCount !== 'all' && action === 'all' && status === 'all')
        setLog(scheduleLog.filter((v) => jobCountCheck(v)));
      else if (jobCount === 'all' && action !== 'all' && status === 'all')
        setLog(scheduleLog.filter((v) => actionCheck(v)));
      else if (jobCount === 'all' && action === 'all' && status !== 'all')
        setLog(scheduleLog.filter((v) => statusCheck(v)));
      else if (jobCount !== 'all' && action !== 'all' && status === 'all')
        setLog(scheduleLog.filter((v) => jobCountCheck(v) && actionCheck(v)));
      else if (jobCount !== 'all' && action === 'all' && status !== 'all')
        setLog(scheduleLog.filter((v) => jobCountCheck(v) && statusCheck(v)));
      else if (jobCount === 'all' && action !== 'all' && status !== 'all')
        setLog(scheduleLog.filter((v) => actionCheck(v) && statusCheck(v)));
      else if (jobCount !== 'all' && action !== 'all' && status !== 'all')
        setLog(
          scheduleLog.filter(
            (v) => jobCountCheck(v) && actionCheck(v) && statusCheck(v),
          ),
        );
    }
  }, [scheduleLog, jobCount, action, status]);

  return (
    <>
      <table className="tbl tbl-basic" style={{ width: '100%' }}>
        <colgroup>
          <col width="15%" />
          <col width="" />
          <col width="20%" />
          <col width="20%" />
        </colgroup>
        <thead>
          <tr>
            <th>회차</th>
            <th>작업</th>
            <th>상태</th>
            <th>시간</th>
          </tr>
        </thead>
        <tbody>
          {_DATA.currentData()?.map((item, i) => (
            <ScheduleLogItem item={item} key={i} />
          ))}
        </tbody>
      </table>
      <Paging
        page={page}
        count={count}
        handleChange={(e, p) => handleChange(e, p)}
      />
    </>
  );
});

export const ScheduleHostLog = React.memo(function ScheduleHostLog({ id }) {
  const { customer } = customerStore();
  const { setScheduleHostLog, scheduleHostLog, jobCount } =
    scheduleHostLogStore();
  const { data, isLoading, isError } = GetScheduleLog(customer.tenantId, id, {
    refreshInterval: 5000,
  });
  const [log, setLog] = React.useState([]);

  const text = (value) => {
    const valueArray = value.split('/');
    const result = valueArray[valueArray.length - 1] ?? '';
    return result;
  };

  React.useEffect(() => {
    if (isError) {
      setLog([]);
      setScheduleHostLog([]);
    } else if (!isLoading && !isError) {
      setLog(data?.data?.items);
      setScheduleHostLog(data?.data?.items);
    }
  }, [data, isLoading, isError]);

  React.useEffect(() => {
    const jobCountCheck = (v) => {
      if (
        v[LOG_KEY_JOBCOUNT] == jobCount &&
        v[LOG_KEY_STATUS] == 'Accepted' &&
        v[LOG_KEY_ACTION] == '10' &&
        v[LOG_KEY_HOSTINFO]
      )
        return true;
      else return false;
    };

    const findObj = (array, value) => {
      const result = array.find((v) => v.resourceId == value) ?? {};
      return result;
    };

    if (scheduleHostLog?.length > 0) {
      const array = scheduleHostLog.filter((v) => jobCountCheck(v));
      const resourceIds = array.map((v) => v.resourceId);
      const uniqueResourceIds = [...new Set(resourceIds)];
      const result = uniqueResourceIds.map((v) => findObj(array, v));

      const hostLogInstance = new ScheduleHostLogDATA(result);
      const hostLoglist = hostLogInstance.init(hostLogInstance.data);
      const sortlist = hostLoglist.sort((a, b) =>
        a[LOG_HOST_KEY_OLDNAME].localeCompare(b[LOG_HOST_KEY_OLDNAME]),
      );
      setLog(sortlist);
    }
  }, [scheduleHostLog, jobCount]);

  return (
    <>
      <div className="tabcontent">
        <table className="tbl tbl-basic" style={{ width: '100%' }}>
          <colgroup>
            <col width="25%" />
            <col width="25%" />
            <col width="25%" />
            <col width="25%" />
          </colgroup>
          <thead>
            <tr>
              <th>Old Host Name</th>
              <th>New Host Name</th>
              <th>SKU</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {log.map((v, i) => (
              <tr key={i}>
                <td className="align-center">
                  {v[LOG_HOST_KEY_OLDNAME] ?? ''}
                </td>
                <td className="align-center">
                  {text(v[LOG_HOST_KEY_NEWNAME]) ?? ''}
                </td>
                <td className="align-center">{v[LOG_HOST_KEY_SKU] ?? ''}</td>
                <td className="align-center">
                  {v[LOG_HOST_KEY_LOCATION] ?? ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
});

export const TitleInput = React.memo(function TitleInput({
  scheduleInfo = {},
}) {
  const { setNewTitle } = titleStore();
  const [title, setTitle] = React.useState('');
  const handleChange = React.useCallback((e) => {
    setTitle(e.target.value);
    setNewTitle(e.target.value);
  }, []);

  //초기화
  React.useEffect(() => {
    if (scheduleInfo[SCHEDULE_KEY_NAME] === undefined) setNewTitle('');
    else handleChange({ target: { value: scheduleInfo[SCHEDULE_KEY_NAME] } });
  }, [scheduleInfo?.scheduleName]);

  return (
    <input
      type="text"
      className="fm-control"
      style={{ width: '100%' }}
      value={title}
      placeholder="예약명을 입력해 주세요."
      onChange={handleChange}
    />
  );
});

export const TabHostLogSelects = React.memo(function TabHostLogSelects({
  index,
}) {
  const { scheduleHostLog, jobCount, setJobCount } = scheduleHostLogStore();

  const Deduplication = (array, key) => {
    const result = array.reduce((acc, cur) => {
      const find = acc.find((v) => v === cur[key]);
      if (!find) acc.push(cur[key]);
      return acc;
    }, []);
    return result.filter((v) => v);
  };

  const RoundSelectEventHandle = (e) => {
    setJobCount(e.target.value);
  };

  React.useEffect(() => {
    const array = Deduplication(scheduleHostLog, LOG_KEY_JOBCOUNT)[0] ?? 1;
    const value = { target: { value: array } };
    RoundSelectEventHandle(value);
  }, [index, scheduleHostLog]);

  return (
    <div className="tab-menu-wrap dp-flex p-b-10">
      <div className="ml-auto p-all-10" style={{ paddingRight: 0 }}>
        <ul className="fm-group">
          <li>
            <select
              className="fm-control"
              style={{ width: '100px' }}
              value={jobCount}
              onChange={RoundSelectEventHandle}
            >
              {Deduplication(scheduleHostLog, LOG_KEY_JOBCOUNT).map((v, i) => (
                <option key={i} value={v}>
                  {v}회차
                </option>
              ))}
            </select>
          </li>
        </ul>
      </div>
    </div>
  );
});

export const TabLogSelects = React.memo(function TabLogSelects({ index }) {
  const { systemcode } = systemcodeStore();
  const { scheduleLog, setJobCount, setAction, setStatus } = scheduleLogStore();

  const findAction = (value) => {
    const result = systemcode.find((v) => v?.codeValue === value);
    return result?.description ?? '';
  };

  const Deduplication = (array, key) => {
    const result = array.reduce((acc, cur) => {
      const find = acc.find((v) => v === cur[key]);
      if (!find) acc.push(cur[key]);
      return acc;
    }, []);
    return result.filter((v) => v);
  };

  const RoundSelectEventHandle = (e) => {
    setJobCount(e.target.value);
  };
  const ActionSelectEventHandle3 = (e) => {
    setAction(e.target.value);
  };
  const StatusSelectEventHandle = (e) => {
    setStatus(e.target.value);
  };

  React.useEffect(() => {
    const value = { target: { value: 'all' } };
    RoundSelectEventHandle(value);
    ActionSelectEventHandle3(value);
    StatusSelectEventHandle(value);
  }, [index]);

  return (
    <div className="tab-menu-wrap dp-flex p-b-10">
      <div className="ml-auto p-all-10" style={{ paddingRight: 0 }}>
        <ul className="fm-group">
          <li>
            <select
              className="fm-control"
              style={{ width: '100px' }}
              onChange={RoundSelectEventHandle}
            >
              <option value={'all'}>전체 회차</option>
              {Deduplication(scheduleLog, LOG_KEY_JOBCOUNT).map((v, i) => (
                <option key={i} value={v}>
                  {v}회차
                </option>
              ))}
            </select>
          </li>
          <li>
            <select
              className="fm-control"
              style={{ width: '100px' }}
              onChange={ActionSelectEventHandle3}
            >
              <option value={'all'}>전체 작업</option>
              {Deduplication(scheduleLog, LOG_KEY_ACTION).map((v, i) => (
                <option key={i} value={v}>
                  {findAction(v)}
                </option>
              ))}
            </select>
          </li>
          <li>
            <select
              className="fm-control"
              style={{ width: '100px' }}
              onChange={StatusSelectEventHandle}
            >
              <option value={'all'}>전체 상태</option>
              {Deduplication(scheduleLog, LOG_KEY_STATUS).map((v, i) => (
                <option key={i} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </li>
        </ul>
      </div>
    </div>
  );
});

export const Tab = React.memo(function Tab({ title }) {
  return (
    <div className="tabs">
      <div className="tab-menu-wrap dp-flex p-b-10">
        <p className="tablinks">{title}</p>
      </div>
    </div>
  );
});

export const ScheduleInformationStatusInput = React.memo(
  function ScheduleInformationStatusInput({ value }) {
    const { setStatus } = statusStore();
    const [select, setSelect] = React.useState(true);

    const SelectHandleChange = React.useCallback((e) => {
      setSelect(e.target.value);
      setStatus(e.target.value);
    }, []);

    //초기화
    React.useEffect(() => {
      if (value === undefined) setStatus(true);
      else SelectHandleChange({ target: { value: value } });
    }, [value]);

    return (
      <td className="align-center">
        <select
          value={select}
          className="fm-control"
          style={{ width: '100%' }}
          onChange={SelectHandleChange}
        >
          {[
            { label: '활성화', value: true },
            { label: '비활성화', value: false },
          ].map((v, i) => (
            <option key={i} value={v.value}>
              {v.label}
            </option>
          ))}
        </select>
      </td>
    );
  },
);

export const ScheduleInformationSubscriptionInput = React.memo(
  function ScheduleInformationSubscriptionInput({ value }) {
    const { setLoading } = loadingStore();
    const { customer } = customerStore();
    const { subscriptions, setSelectSubscription } = subscriptionStore();
    const [select, setSelect] = React.useState('');

    const updateHost = async (id) => {
      if (id && id?.length > 0) {
        try {
          setLoading(true);
          await getAPI(
            `/monitoring/ms-host-info/tenant/${customer.tenantId}/subscription/${id}`,
          );
          setTimeout(() => setLoading(false), 1500);
        } catch {
          setLoading(false);
          return 0;
        }
      }
    };

    const SelectHandleChange = React.useCallback((e) => {
      setSelect(e.target.value);
      updateHost(e.target.value);
      setSelectSubscription(e.target.value);
    }, []);

    //초기화
    React.useEffect(() => {
      if (value === undefined) setSelectSubscription('');
      else SelectHandleChange({ target: { value: value } });
    }, [value]);

    return (
      <td className="align-center">
        <select
          value={select}
          className="fm-control"
          style={{ width: '100%' }}
          onChange={SelectHandleChange}
        >
          <option value="">선택</option>
          {subscriptions.map((v, i) => (
            <option key={i} value={v?.id ?? ''}>
              {v?.id ?? ''}
            </option>
          ))}
        </select>
      </td>
    );
  },
);

export const ScheduleInformationDateInput = React.memo(
  function ScheduleInformationDateInput({ value }) {
    const { setNewStartDate, setNewStartTime } = dateStore();
    const [startDate, setStartDate] = React.useState(
      moment().format('YYYY-MM-DD'),
    );
    const [startTime, setStartTime] = React.useState(moment().format('HH:mm'));
    const StartDateHandleChange = React.useCallback((e) => {
      setStartDate(e.target.value);
      setNewStartDate(e.target.value);
    }, []);
    const StartTimeHandleChange = React.useCallback((e) => {
      setStartTime(e.target.value);
      setNewStartTime(e.target.value);
    }, []);

    //초기화
    React.useEffect(() => {
      if (value === undefined) {
        setNewStartDate(moment().format('YYYY-MM-DD'));
        setNewStartTime(moment().format('HH:mm'));
      } else {
        StartDateHandleChange({
          target: { value: moment(value).format('YYYY-MM-DD') },
        });
        StartTimeHandleChange({
          target: { value: moment(value).format('HH:mm') },
        });
      }
    }, [value]);

    return (
      <td className="align-center">
        <input
          type="date"
          className="fm-control"
          style={{ width: '100%' }}
          value={startDate}
          onChange={StartDateHandleChange}
        />
        <div className="space-10"></div>
        <input
          type="time"
          className="fm-control"
          style={{ width: '100%' }}
          value={startTime}
          onChange={StartTimeHandleChange}
        />
      </td>
    );
  },
);

export const ScheduleInformationRepeatedInput = React.memo(
  function ScheduleInformationRepeatedInput({ value }) {
    const { setNewRepeatedInput, setNewRepeated, setNewWeek, setNewDayofweek } =
      repeatedStore();
    const [repeatedInput, setRepeatedInput] = React.useState('');
    const [repeated, setRepeated] = React.useState('00');
    const [week, setWeek] = React.useState('1'); //주
    const [dayofweek, setDayofweek] = React.useState('0'); //요일

    const RepeatedInputHandleChange = React.useCallback((v) => {
      setRepeatedInput(v);
      setNewRepeatedInput(v);
    }, []);
    const RepeatedHandleChange = React.useCallback((e) => {
      if (e.target.value === '00') RepeatedInputHandleChange('');
      setRepeated(e.target.value);
      setNewRepeated(e.target.value);
    }, []);
    const WeekHandleChange = React.useCallback((e) => {
      setWeek(e.target.value);
      setNewWeek(e.target.value);
    }, []);
    const DayofweekHandleChange = React.useCallback((e) => {
      setDayofweek(e.target.value);
      setNewDayofweek(e.target.value);
    }, []);

    const RepeatedInputDisabled = React.useCallback((arg) => {
      if (arg === '00') return true;
      else return false;
    });
    const RepeatedOptionsInputOpen = React.useCallback((arg) => {
      if (arg !== '00') return true;
      else return false;
    });
    const RepeatedWeekOptionInputOpen = React.useCallback((arg) => {
      if (arg == '02') return true;
      else return false;
    });
    const RepeatedDayofweekOptionInputOpen = React.useCallback((arg) => {
      if (arg == '01' || arg == '02') return true;
      else return false;
    });

    //초기화
    React.useEffect(() => {
      if (value === undefined) {
        setNewRepeatedInput('');
        setNewRepeated('00');
        setNewWeek('1');
        setNewDayofweek('0');
      } else {
        if (value?.repeated !== '00') {
          RepeatedInputHandleChange(value?.repeatedInput);
          RepeatedHandleChange({ target: { value: value?.repeated } });
          WeekHandleChange({ target: { value: value?.week } });
          DayofweekHandleChange({ target: { value: value?.dayofweek } });
        } else {
          setNewRepeatedInput('');
          setNewRepeated('00');
          setNewWeek('1');
          setNewDayofweek('0');
        }
      }
    }, [value]);

    return (
      <td className="align-center">
        <div className="dp-flex">
          <NumericFormat
            disabled={RepeatedInputDisabled(repeated)}
            className="fm-control mr-5 align-center"
            style={{ width: '80px' }}
            value={repeatedInput}
            allowLeadingZeros={false} //0부터 시작
            allowNegative={false} //음수
            thousandSeparator={true} //,
            thousandsGroupStyle="thousand"
            displayType="input"
            type="text"
            onValueChange={({ floatValue }) => {
              if (floatValue) RepeatedInputHandleChange(floatValue);
              else RepeatedInputHandleChange('');
            }}
          />
          <select
            className="fm-control"
            style={{ width: '100%' }}
            value={repeated}
            onChange={RepeatedHandleChange}
          >
            <option value={'00'}>반복 안 함</option>
            <option value={'01'}>주</option>
            <option value={'02'}>개월</option>
            {/* <option value={'year'}>년</option> */}
          </select>
        </div>

        {RepeatedOptionsInputOpen(repeated) && (
          <div>
            <div className="space-10"></div>
            <div className="dp-flex">
              {RepeatedWeekOptionInputOpen(repeated) && (
                <select
                  className="fm-control mr-5"
                  style={{ width: '100%' }}
                  value={week}
                  onChange={WeekHandleChange}
                >
                  <option value={'1'}>첫째 주</option>
                  <option value={'2'}>둘째 주</option>
                  <option value={'3'}>셋째 주</option>
                  <option value={'4'}>넷째 주</option>
                  <option value={'5'}>다섯째 주</option>
                </select>
              )}
              {RepeatedDayofweekOptionInputOpen(repeated) && (
                <select
                  className="fm-control"
                  style={{ width: '100%' }}
                  value={dayofweek}
                  onChange={DayofweekHandleChange}
                >
                  <option value={'0'}>일요일</option>
                  <option value={'1'}>월요일</option>
                  <option value={'2'}>화요일</option>
                  <option value={'3'}>수요일</option>
                  <option value={'4'}>목요일</option>
                  <option value={'5'}>금요일</option>
                  <option value={'6'}>토요일</option>
                </select>
              )}
            </div>
          </div>
        )}
      </td>
    );
  },
);

export const ScheduleInformation = React.memo(function ScheduleInformation({
  scheduleInfo = {},
}) {
  return (
    <>
      <Tab title={'예약정보'} />
      <div id="schedule-thum-default" className="tabcontent">
        <table className="tbl tbl-basic" style={{ width: '100%' }}>
          <colgroup>
            <col width="13%" />
            <col width="37%" />
            <col width="23%" />
            <col width="27%" />
          </colgroup>
          <thead>
            <tr>
              <th>상태</th>
              <th>구독</th>
              <th>시작시각</th>
              <th>반복설정</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <ScheduleInformationStatusInput
                value={scheduleInfo[SCHEDULE_KEY_STATE]}
              />
              <ScheduleInformationSubscriptionInput
                value={scheduleInfo[SCHEDULE_KEY_SUBSID]}
              />
              <ScheduleInformationDateInput
                value={scheduleInfo[SCHEDULE_KEY_STARTDATETIME]}
              />
              <ScheduleInformationRepeatedInput
                value={
                  Object.keys(scheduleInfo)?.length > 0
                    ? {
                        repeatedInput:
                          scheduleInfo[SCHEDULE_KEY_SCHEDULETYPE] === '01'
                            ? scheduleInfo[SCHEDULE_KEY_REPEATCYCLEWEEK]
                            : scheduleInfo[SCHEDULE_KEY_SCHEDULETYPE] === '02'
                            ? scheduleInfo[SCHEDULE_KEY_REPEATCYCLEMONTH]
                            : '',
                        repeated: scheduleInfo[SCHEDULE_KEY_SCHEDULETYPE],
                        week: scheduleInfo[SCHEDULE_KEY_REPEATCYCLEWEEK],
                        dayofweek: scheduleInfo[SCHEDULE_KEY_REPEATCYCLEDAY],
                      }
                    : undefined
                }
              />
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
});

export const HostInformation = React.memo(function HostInformation() {
  const { selectSubscription } = subscriptionStore();
  const { setNewCheckHostList } = hostStore();
  const [allCheck, setAllCheck] = React.useState(true);
  const [check, setCheck] = React.useState([]);
  const [hostList, setHostList] = React.useState([]);
  const { data, isLoading, isError } = GetHost(
    {
      revalidateOnFocus: false, //창이 포커싱되었을 때 자동 갱신 방지
      revalidateOnReconnect: false, //브라우저가 네트워크 연결을 다시 얻었을 때 자동으로 갱신
    },
    selectSubscription,
  );

  const GetHostList = async (result) => {
    const hostInstance = new ScheduleHostDATA(result);
    const hostlist = hostInstance.init(hostInstance.data);
    setHostList(hostlist);
  };

  //초기화
  React.useEffect(() => {
    setNewCheckHostList([]);
  }, []);

  React.useEffect(() => {
    setNewCheckHostList(check);
  }, [check]);

  React.useEffect(() => {
    if (isError) GetHostList([]);
    else if (!isLoading && !isError && data) GetHostList(data);
  }, [isLoading, data, isError]);

  React.useEffect(() => {
    if (check?.length === hostList?.length) setAllCheck(true);
  }, [check, hostList]);

  React.useEffect(() => {
    if (allCheck && hostList?.length > 0)
      setCheck(hostList.map((v) => v[MONITORING_HOST_KEY_NAME]));
    else if (!allCheck && hostList?.length > 0) {
      if (hostList?.length === check?.length) setCheck([]);
    } else if (hostList?.length === 0) setCheck([]);
  }, [allCheck, hostList]);

  const ChekHandler = async (e, value) => {
    if (e.target.checked) setCheck((check) => [...check, value]);
    else {
      setCheck(check.filter((o) => o !== value));
      setAllCheck(false);
    }
  };

  const HostTableList = hostList.map((value, index) => (
    <tr key={value?.id ?? index}>
      <td className="align-center">
        <label className="checkbox">
          <input
            type="checkbox"
            name="selectRow"
            onChange={(e) => ChekHandler(e, value[MONITORING_HOST_KEY_NAME])}
            checked={
              check.indexOf(value[MONITORING_HOST_KEY_NAME]) > -1 ? true : false
            }
          />
          <span className="mark"></span>
        </label>
      </td>
      <td className="align-center">{value[MONITORING_HOST_KEY_NAME]}</td>
      <td className="align-center">{value[MONITORING_HOST_KEY_SKU]}</td>
      <td className="align-center">
        {value[MONITORING_HOST_KEY_SKU_LOCATION]}
      </td>
      <td className="align-center">{value[MONITORING_HOST_KEY_STATUSES]}</td>
    </tr>
  ));

  return (
    <>
      <Tab title={'호스트정보'} />
      <div id="schedule-thum-host" className="tabcontent">
        <table className="tbl tbl-basic tbl-tiny" style={{ width: '100%' }}>
          <colgroup>
            <col width="8%" />
            <col width="25%" />
            <col width="25%" />
            <col width="25%" />
            <col width="" />
          </colgroup>
          <thead>
            <tr>
              <th>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    name="selectRow"
                    onChange={(e) => setAllCheck(e.target.checked)}
                    checked={allCheck}
                  />
                  <span className="mark"></span>
                </label>
              </th>
              <th>Host Name</th>
              <th>SKU</th>
              <th>Location</th>
              <th>Statuses</th>
            </tr>
          </thead>
          <tbody>{HostTableList}</tbody>
        </table>
      </div>
    </>
  );
});

export const EditHostInformation = React.memo(function EditHostInformation({
  scheduleInfo = {},
}) {
  const { selectSubscription } = subscriptionStore();
  const { setNewCheckHostList } = hostStore();
  const [scheduleInfoCheck, setScheduleInfoCheck] = React.useState(false); //scheduleInfo의 host데이터 상태
  const [allCheck, setAllCheck] = React.useState(false);
  const [check, setCheck] = React.useState([]);
  const [hostList, setHostList] = React.useState([]);
  const { data, isLoading, isError } = GetHost(
    {
      revalidateOnFocus: false, //창이 포커싱되었을 때 자동 갱신 방지
      revalidateOnReconnect: false, //브라우저가 네트워크 연결을 다시 얻었을 때 자동으로 갱신
    },
    selectSubscription,
  );

  const GetHostList = async (result) => {
    const hostInstance = new ScheduleHostDATA(result);
    const hostlist = hostInstance.init(hostInstance.data);
    setHostList(hostlist);
  };

  //초기화
  React.useEffect(() => {
    setNewCheckHostList([]);
  }, []);

  React.useEffect(() => {
    setNewCheckHostList(check);
  }, [check]);

  React.useEffect(() => {
    if (isError) GetHostList([]);
    else if (!isLoading && !isError && data) GetHostList(data);
  }, [isLoading, data, isError]);

  React.useEffect(() => {
    if (scheduleInfoCheck) {
      if (check?.length === hostList?.length) setAllCheck(true);
    }
  }, [check, hostList, scheduleInfoCheck]);

  React.useEffect(() => {
    if (allCheck && hostList?.length > 0)
      setCheck(hostList.map((v) => v[MONITORING_HOST_KEY_NAME]));
    else if (!allCheck && hostList?.length > 0) {
      if (hostList?.length === check?.length) setCheck([]);
    } else if (hostList?.length === 0) setCheck([]);
  }, [allCheck, hostList]);

  React.useEffect(() => {
    if (scheduleInfo[SCHEDULE_KEY_TARGETHOSTLIST] !== undefined) {
      setCheck(scheduleInfo[SCHEDULE_KEY_TARGETHOSTLIST]);
      setScheduleInfoCheck(true);
    }
  }, [scheduleInfo?.targetHostList]);

  const ChekHandler = async (e, value) => {
    if (e.target.checked) setCheck((check) => [...check, value]);
    else {
      setCheck(check.filter((o) => o !== value));
      setAllCheck(false);
    }
  };

  const HostTableList = hostList.map((value, index) => (
    <tr key={value?.id ?? index}>
      <td className="align-center">
        <label className="checkbox">
          <input
            type="checkbox"
            name="selectRow"
            onChange={(e) => ChekHandler(e, value[MONITORING_HOST_KEY_NAME])}
            checked={
              check.indexOf(value[MONITORING_HOST_KEY_NAME]) > -1 ? true : false
            }
          />
          <span className="mark"></span>
        </label>
      </td>
      <td className="align-center">{value[MONITORING_HOST_KEY_NAME]}</td>
      <td className="align-center">{value[MONITORING_HOST_KEY_SKU]}</td>
      <td className="align-center">
        {value[MONITORING_HOST_KEY_SKU_LOCATION]}
      </td>
      <td className="align-center">{value[MONITORING_HOST_KEY_STATUSES]}</td>
    </tr>
  ));

  return (
    <>
      <Tab title={'호스트정보'} />
      <div id="schedule-thum-host" className="tabcontent">
        <table className="tbl tbl-basic tbl-tiny" style={{ width: '100%' }}>
          <colgroup>
            <col width="8%" />
            <col width="25%" />
            <col width="25%" />
            <col width="25%" />
            <col width="" />
          </colgroup>
          <thead>
            <tr>
              <th>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    name="selectRow"
                    onChange={(e) => setAllCheck(e.target.checked)}
                    checked={allCheck}
                  />
                  <span className="mark"></span>
                </label>
              </th>
              <th>Host Name</th>
              <th>SKU</th>
              <th>Location</th>
              <th>Statuses</th>
            </tr>
          </thead>
          <tbody>{HostTableList}</tbody>
        </table>
      </div>
    </>
  );
});

export const ScheduleRefreshButton = React.memo(
  function ScheduleRefreshButton() {
    const { customer } = customerStore();
    const { setScheduleList } = scheduleListStore();

    const RefreshButton = async () => {
      const result = await GetSchedule(customer.tenantId);
      setScheduleList(result);
    };

    return (
      <>
        <button className="btn btn-solid" onClick={() => RefreshButton()}>
          새로고침
        </button>
      </>
    );
  },
);

ScheduleLogItem.propTypes = {
  item: PropTypes.object,
};

ScheduleLog.propTypes = {
  id: PropTypes.any,
};

ScheduleHostLog.propTypes = {
  id: PropTypes.any,
};

Tab.propTypes = {
  title: PropTypes.string,
};

TitleInput.propTypes = {
  scheduleInfo: PropTypes.object,
};

TabHostLogSelects.propTypes = {
  index: PropTypes.any,
};

TabLogSelects.propTypes = {
  index: PropTypes.any,
};

ScheduleInformation.propTypes = {
  scheduleInfo: PropTypes.object,
};

EditHostInformation.propTypes = {
  scheduleInfo: PropTypes.object,
};

ScheduleInformationStatusInput.propTypes = {
  value: PropTypes.any,
};

ScheduleInformationSubscriptionInput.propTypes = {
  value: PropTypes.any,
};

ScheduleInformationDateInput.propTypes = {
  value: PropTypes.any,
};

ScheduleInformationRepeatedInput.propTypes = {
  value: PropTypes.any,
};

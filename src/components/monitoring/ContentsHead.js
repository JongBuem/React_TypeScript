import React from 'react';
import PropTypes from 'prop-types';
import { MonitoringStatus } from 'common/class/monitoring';
import {
  MONITORING_HOST_STATUSES_KEY,
  MONITORING_vm_STATUSES_KEY,
  MONITORING_HOST_STATUSES_AVAILABLE,
  MONITORING_VM_STATUSES_RUNNING,
} from 'common/constants/monitoring.constant';

export default function ContentsHead({
  hostList,
  vmList,
  subscriptionId,
  subscriptionIds,
  onChange,
}) {
  const [hostCount, setHostCount] = React.useState(0);
  const [vmCount, setVmCount] = React.useState(0);

  React.useEffect(() => {
    const hostStatusInstance = new MonitoringStatus(
      hostList,
      MONITORING_HOST_STATUSES_KEY,
    );
    const result = hostStatusInstance.init(
      hostStatusInstance.list,
      hostStatusInstance.type,
    );
    setHostCount(result[MONITORING_HOST_STATUSES_AVAILABLE]);
  }, [hostList]);

  React.useEffect(() => {
    const VmStatusInstance = new MonitoringStatus(
      vmList,
      MONITORING_vm_STATUSES_KEY,
    );
    const result = VmStatusInstance.init(
      VmStatusInstance.list,
      VmStatusInstance.type,
    );
    setVmCount(result[MONITORING_VM_STATUSES_RUNNING]);
  }, [vmList]);

  return (
    <div className="contents-head">
      <div className="inner">
        <h2 className="page-title">Monitoring</h2>
        <div className="head-info-wrap">
          <div className="head-st-wrap">
            <div className="head-st-item">
              <p className="head-st-label">Host Available</p>
              <div className="head-st-count">
                <span className="running">{hostCount}</span>
                <span className="diagonal">/</span>
                <span className="total">{hostList.length}</span>
              </div>
            </div>
            <div className="head-st-item">
              <p className="head-st-label">VM Running</p>
              <div className="head-st-count">
                <span className="running">{vmCount}</span>
                <span className="diagonal">/</span>
                <span className="total">{vmList.length}</span>
              </div>
            </div>
            <div className="head-st-item">
              <p className="head-st-label">Subscription</p>
              <div className="head-st-count">
                <MonitoringSubscriptionInput
                  subscriptionId={subscriptionId}
                  subscriptionIds={subscriptionIds}
                  onChange={(value) => onChange(value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="space-30"></div>
    </div>
  );
}

export const MonitoringSubscriptionInput = React.memo(
  function MonitoringSubscriptionInput({
    subscriptionId,
    subscriptionIds,
    onChange,
  }) {
    const [select, setSelect] = React.useState(subscriptionId);

    const SelectHandleChange = React.useCallback((e) => {
      setSelect(e.target.value);
      onChange(e.target.value);
    }, []);

    //초기화
    React.useEffect(() => {
      SelectHandleChange({ target: { value: subscriptionId } });
    }, [subscriptionId]);

    return (
      <select
        value={select}
        className="fm-control"
        style={{
          width: '270px',
          height: '30px',
          padding: '5px',
          background: '#0065CC',
          color: '#FFFF',
        }}
        onChange={SelectHandleChange}
      >
        <option value="" disabled style={{ color: '#92A6D0' }}>
          선택
        </option>
        {subscriptionIds.map((v, i) => (
          <option key={i} value={v?.id ?? ''}>
            {v?.id ?? ''}
          </option>
        ))}
      </select>
    );
  },
);

ContentsHead.propTypes = {
  hostList: PropTypes.array,
  vmList: PropTypes.array,
  subscriptionId: PropTypes.string,
  subscriptionIds: PropTypes.array,
  onChange: PropTypes.func,
};

MonitoringSubscriptionInput.propTypes = {
  subscriptionId: PropTypes.string,
  subscriptionIds: PropTypes.array,
  onChange: PropTypes.func,
};

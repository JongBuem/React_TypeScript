import React from 'react';
import { Items, ItemsLoading } from './ContentsBodyItems';
import {
  MONITORING_HOST_KEY_NAME,
  MONITORING_HOST_KEY_SKU,
  MONITORING_HOST_KEY_STATUSES,
  MONITORING_HOST_KEY_VIRTUALMACHINES,
} from 'common/constants/monitoring.constant';
import PropTypes from 'prop-types';

function ContentsBody({ dataList, hostListLoading, vmListLoading }) {
  const data = JSON.parse(dataList);
  return (
    <div className="contents-body">
      <div className="inner">
        <div className="inner-item">
          {hostListLoading === true &&
          vmListLoading === true &&
          data.length == 0
            ? [1, 2, 3, 4, 5].map((v, i) => <ItemsLoading key={i} />)
            : Array.isArray(data[0]) &&
              data[0]?.map((v, i) => (
                <Items
                  key={i}
                  hostName={v[MONITORING_HOST_KEY_NAME]}
                  skuName={v[MONITORING_HOST_KEY_SKU]}
                  hostStatus={v[MONITORING_HOST_KEY_STATUSES]}
                  vm={JSON.stringify(
                    v[MONITORING_HOST_KEY_VIRTUALMACHINES] ?? [],
                  )}
                />
              ))}
        </div>
        <div className="inner-item">
          {hostListLoading === true &&
          vmListLoading === true &&
          data.length == 0
            ? [1, 2, 3, 4, 5].map((v, i) => <ItemsLoading key={i} />)
            : Array.isArray(data[1]) &&
              data[1]?.map((v, i) => (
                <Items
                  key={i}
                  hostName={v[MONITORING_HOST_KEY_NAME]}
                  skuName={v[MONITORING_HOST_KEY_SKU]}
                  hostStatus={v[MONITORING_HOST_KEY_STATUSES]}
                  vm={JSON.stringify(
                    v[MONITORING_HOST_KEY_VIRTUALMACHINES] ?? [],
                  )}
                />
              ))}
        </div>
      </div>
      <div className="space-80"></div>
    </div>
  );
}

ContentsBody.propTypes = {
  dataList: PropTypes.any,
  hostListLoading: PropTypes.bool,
  vmListLoading: PropTypes.bool,
};
export default React.memo(ContentsBody);

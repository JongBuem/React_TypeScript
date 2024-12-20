import React from "react";
import { Items, ItemsLoading } from "./ContentsBodyItems";
import { MonitoringHostConstant } from "common/constants";
import { DataList } from "../types";

export interface ContentsBodyIF {
  dataList: string;
  hostListLoading: boolean;
  vmListLoading: boolean;
}

function ContentsBody({
  dataList,
  hostListLoading,
  vmListLoading,
}: ContentsBodyIF) {
  const data: DataList[][] = JSON.parse(dataList);

  return (
    <div className="contents-body">
      <div className="inner">
        <div className="inner-item">
          {hostListLoading === true &&
          vmListLoading === true &&
          data.length === 0
            ? [1, 2, 3, 4, 5].map((v, i) => <ItemsLoading key={i} />)
            : Array.isArray(data[0]) &&
              data[0]?.map((v, i) => (
                <Items
                  key={i}
                  hostName={v[MonitoringHostConstant.MONITORING_HOST_KEY_NAME]}
                  skuName={v[MonitoringHostConstant.MONITORING_HOST_KEY_SKU]}
                  hostStatus={
                    v[MonitoringHostConstant.MONITORING_HOST_KEY_STATUSES]
                  }
                  vm={JSON.stringify(
                    v[
                      MonitoringHostConstant.MONITORING_HOST_KEY_VIRTUALMACHINES
                    ] ?? []
                  )}
                />
              ))}
        </div>
        <div className="inner-item">
          {hostListLoading === true &&
          vmListLoading === true &&
          data.length === 0
            ? [1, 2, 3, 4, 5].map((v, i) => <ItemsLoading key={i} />)
            : Array.isArray(data[1]) &&
              data[1]?.map((v, i) => (
                <Items
                  key={i}
                  hostName={v[MonitoringHostConstant.MONITORING_HOST_KEY_NAME]}
                  skuName={v[MonitoringHostConstant.MONITORING_HOST_KEY_SKU]}
                  hostStatus={
                    v[MonitoringHostConstant.MONITORING_HOST_KEY_STATUSES]
                  }
                  vm={JSON.stringify(
                    v[
                      MonitoringHostConstant.MONITORING_HOST_KEY_VIRTUALMACHINES
                    ] ?? []
                  )}
                />
              ))}
        </div>
      </div>
      <div className="space-80"></div>
    </div>
  );
}

export default React.memo(ContentsBody);

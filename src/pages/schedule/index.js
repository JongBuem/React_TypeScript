import React from 'react';
import { Outlet } from 'react-router-dom';
import HeadContents from 'components/schedule/HeadContents';
import LeftContents from 'components/schedule/LeftContents';
import PropTypes from 'prop-types';
import { useAxiosSwr, getAPI, postAPI, patchAPI } from 'common/api/CmwApi';

// export const GetSchedule = () => {
//   const { customer } = customerStore();
//   const [helloData, setHelloData] = useState([]);

//   const GET = async (customerId) => {
//     console.log(customerId);
//     const result = await getAPI('/schedule');
//     if (result?.data?.length > 0) setHelloData(result.data);
//     else setHelloData([]);
//   };

//   useEffect(() => {
//     GET(customer);
//   }, [customer]);

//   return helloData;
// };

export async function GetScheduleInfo(scheduleId) {
  return await getAPI(`/schedule/${scheduleId}`)
    .then(({ data }) => {
      return {
        ...data?.schedule,
        host: data?.host,
      };
    })
    .catch(() => undefined);
}

export async function GetSchedule(tenantId) {
  return await getAPI(`/schedule/tenantId/${tenantId}`)
    .then(({ data }) => {
      if (data?.length > 0) return data;
      else return [];
    })
    .catch(() => []);
}

export async function PostSchedule(body) {
  return await postAPI(`/schedule/tenantId/${body.tenantId}`, body)
    .then(({ data }) => {
      if (data?._id) return data._id;
      else return undefined;
    })
    .catch(() => undefined);
}

export async function PatchSchedule(scheduleId, body) {
  return await patchAPI(`/schedule/${scheduleId}`, body)
    .then(({ data }) => {
      if (data?._id) return data._id;
      else return undefined;
    })
    .catch(() => undefined);
}

export function GetScheduleLog(customerId, scheduleID, option = {}) {
  const { data, error, mutate, isLoading } = useAxiosSwr(
    `/logs/${customerId}/schedules/${scheduleID}`,
    null,
    option,
  );
  return {
    mutate,
    data,
    isLoading,
    isError: error,
  };
}

function Schedule() {
  console.log('Schedule');

  return (
    <React.Fragment>
      <HeadContents />
      <div className="contents-body" style={{ paddingBottom: 30 }}>
        <div className="inner">
          <div className="space-30"></div>
          <div className="area-wrap">
            <LeftContents />
            <Outlet />
          </div>
          <div className="space-80"></div>
        </div>
      </div>
    </React.Fragment>
  );
}
Schedule.propTypes = {
  content: PropTypes.any,
};
export default React.memo(Schedule);

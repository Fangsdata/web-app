import { OFFLOADAPI } from '../Constants';

async function getDataFromApi(filter) {
  let url = `${OFFLOADAPI}/offloads?`;
  let params = '';
  Object.getOwnPropertyNames(filter).forEach(
    (prop) => {
      if (typeof (filter[prop] === 'object')) {
        if (filter[prop].length !== 0) {
          params += `${prop}=`;
          filter[prop].forEach((p) => {
            params += `${p},`;
          });
          params = params.substring(0, params.length - 1);
        }
        params += '&';
      }
    },
  );
  params = params.substring(0, params.length - 1);

  url += params;
  const resp = await fetch(url);
  const json = await resp.json();
  return json;
}

const getOffloads = async (filter = {}) => {
  const data = await getDataFromApi(filter);
  if (data.status !== 400) {
    return data;
  }
  return [];
};
const getBoats = async (radioSignal = '') => {
  const resp = await fetch(`${OFFLOADAPI}/boats/${radioSignal}`);
  const json = await resp.json();
  return json;
};

const getBoatByRegistration = async (registratinId) => {
  const resp = await fetch(`${OFFLOADAPI}/boats/registration/${registratinId}`);
  const json = await resp.json();
  return json;
}

const getBoatLocation = async ( radioSignal ) => {
  const resp = await fetch(`${OFFLOADAPI}/maps/boats/radio/${radioSignal}`);
  const json = await resp.json();
  return json; 
}

const getValue = async (key = '') => {
  const resp = await fetch(`${OFFLOADAPI}/key/${key}`);
  const json = await resp.text();
  return json;
}

const getBoatOffladsTimeframe = async (boatRegId, from, to) => {
  const resp = await fetch(`${OFFLOADAPI}/offloads/${boatRegId}/date/${from}/${to}`);
  if (resp.status == '404'){
    return [];
  }
  const json = await resp.json();
  return json;
}

const getOffloadDetails = async ( date, registrationId ) => {
  const resp = await fetch(`${OFFLOADAPI}/offloads/details/date/${date}/${registrationId}`);
  const json = await resp.json();
  return json; 
}

export {
  getOffloads,
  getBoats,
  getBoatByRegistration,
  getBoatOffladsTimeframe,
  getBoatLocation,
  getValue,
  getOffloadDetails,
};

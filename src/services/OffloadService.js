import { el } from 'date-fns/locale';
import { OFFLOADAPI } from '../Constants';

async function sendQuery(inUrl, queryParam) {
  let url = inUrl + '?';
  let params = '';
  Object.getOwnPropertyNames(queryParam).forEach(
    (prop) => {
      if (typeof (queryParam[prop] === 'object')) {
        if (queryParam[prop].length !== 0) {
          params += `${prop}=`;
          queryParam[prop].forEach((p) => {
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
  const data = await sendQuery(`${OFFLOADAPI}/offloads`, filter);
  if (data.status !== 400) {
    return data;
  }
  return [];
};

const getOwners = async (filter = {}) => {
  const data = await sendQuery(`${OFFLOADAPI}/owners` ,filter);
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

const getBoatById = async (id) => {
  const resp = await fetch(`${OFFLOADAPI}/boats/id/${id}`);
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
  const url = `${OFFLOADAPI}/Offloads/${boatRegId}/date/${from}/${to}`;
  const resp = await fetch(url);
  if (resp.status == '404'){
    return [];
  }
  const json = await resp.json();
  return json;
}

const getOffloadDetails = async ( date, registrationId ) => {
  const resp = await fetch(`${OFFLOADAPI}/Offloads/details/date/${date}/${registrationId}`);
  const json = await resp.json();
  return json; 
}

const getBoatNameHistory = async ( boatId ) => {
  const resp = await fetch(`${OFFLOADAPI}/boats/namehistory/${boatId}`);
  const json = await resp.json();
  return json;  
}

const getFilter = async ( filter, param = '' ) => {

  const resp = await fetch(`${OFFLOADAPI}/sitedata/filters/${filter}/${param}`);
  const json = await resp.json();
  return json; 
}

export {
  getOffloads,
  getOwners,
  getBoats,
  getBoatByRegistration,
  getBoatOffladsTimeframe,
  getBoatLocation,
  getValue,
  getOffloadDetails,
  getBoatById,
  getBoatNameHistory,
  getFilter
};

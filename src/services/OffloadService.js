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

const getOffloadsTest = async () => {
  const resp = await fetch(`${OFFLOADAPI}/offloads?fishingGear=Garn&Count=5`);
  const json = await resp.json();
  return json;
};

export {
  getOffloads,
  getBoats,
  getOffloadsTest,
};

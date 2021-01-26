import { format } from 'date-fns';


export const normalizeCase = (str) => {
  if (str === null || str === undefined) {
    return '';
  }
  
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

export const normalizeLength = (txtInput) => {
  const e = txtInput;
  if (typeof e === 'number') {
    if (e === 0) {
      return 'ikke registrert';
    }
    return `${e.toFixed(1)} m`;
  }
  return e;
};

export const normalizeWeight = (txtInput) => {
  let e = txtInput;
  if (typeof e === 'number') {
    if (e === 0) {
      return 'ikke registrert';
    }
    if (e >= 1000) {
      e /= 1000;
      if (e < 100) {
        e = e.toFixed(1);
      } else {
        e = e.toFixed(0);
      }

      return `${e} t`;
    }
    if (e <= 1) {
      e *= 1000;
      e = e.toFixed(1);
      return `${e} gr`;
    }

    e = e.toFixed(1);
    return `${e} kg`;
  }

  return e;
};

export const shortinString = (input, desiredLength) => {
  if (input.length <= desiredLength){
    return input;
  }
  else {
    return input.substr(0, desiredLength - 3) + "...";
  }

} 
export const normalizeDate = (e) => format(new Date(e), 'd/M/yyyy');

export const normalizeMonth = (e) => {
  switch (e) {
    case 0: return '';
    case 1: return 'januar';
    case 2: return 'februar';
    case 3: return 'mars';
    case 4: return 'april';
    case 5: return 'mai';
    case 6: return 'juni';
    case 7: return 'juli';
    case 8: return 'august';
    case 9: return 'september';
    case 10: return 'oktober';
    case 11: return 'november';
    case 12: return 'desember';
    default: return 'prim';
  }
};

export const generateObjectFromQueryParameters = (inputString) => {
  if(inputString == ""){
    return "";
  }
  let jsObject = {};
  let params = inputString.substr(1).toLowerCase().split("&");
  params.forEach(param => {
    let item = param.split('=');
    jsObject[item[0]] = item[1].split(',');
  });
  return jsObject;
}


export const translateGroupNames = (input) => {
  switch (input) {
    case 'fishingGear': return 'redskap';
    case 'boatLength': return 'lengde';
    case 'fishName': return 'fisketype';
    case 'landingState': return 'fylke';
    default: return '';
  }
}

export const generateQueryParamFromObject = (inputObj) => {

  let queryString = '?';
  Object.keys(inputObj).forEach((key)=>{
    queryString += key + '=';

    inputObj[key].forEach((item)=>{
      queryString += item + ',';
    });
    queryString = queryString.substring(0, queryString.length - 1);
    queryString += '&';
  });
  queryString = queryString.substring(0, queryString.length - 1);
  return queryString;
}



export const getOrginizationInfo = async ( id ) => {
    const resp = await fetch(`https://data.brreg.no/enhetsregisteret/api/enheter/${id}`);
    const json = await resp.json();
    console.log(json)
    return json; 
  } 
  

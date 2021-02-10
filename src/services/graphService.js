


export const generateColors = (size) => {
    const colorExample = [
        '#2B59C3', //Blue
        '#2bc363', //Green
        '#f5e536', //Yellow
        '#c32b2b', //red
        '#2bc0c3', //light blue
        '#c3742b', //pink
        '#c32ba5', //orange
        '#93c32b', //light green
        '#0a1d4a', //Svartur
        '#982bc3', //purple
        '#d7e1f7', //hvítur
    
    ];
    const retData = [];
    for (let i = 0; i < size; i++) {
        retData.push(colorExample[i % colorExample.length]);
    }
    return retData;

  };

 // '#2B59C3', 
 // '#B7DFB3',
 // '#DCB8B8',
 // '#DCD8B8'
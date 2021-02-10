import { normalizeDate } from "./TextTools";

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

export class GenerateGraphData {

    constructor(data){
        this.data = data;

        this.colors = generateColors(data.length);
        this.barLabels = this.generateBarLabels();
        this.barRows = this.generateBarRows();
    };

    reduceData(cutOffPoint = 0.05, cutOffName = 'resten'){
        this.data = this.data.map(i => {
            if (typeof(i.fish) === 'object'){
              i.fish = i.fish.map((j)=> {
                if( j.weight / i.totalWeight < cutOffPoint ){
                  j.type = cutOffName;
                  return j;
                }
                else {
                  return j;
                }
              })
            }
            return i;
          })
        return this;
    }
    setLabels(newLabels){
        this.barLabels = newLabels;
    }
    combineMonths() {
        return this;
    }
    combineYeras() {
        return this;
    }    

    generateBarDataShcema () {
        
        return this.barRows.map( (i, len) => {
            return {  label: i,
                      backgroundColor: this.colors[len],
                      borderColor: 'rgba(0,0,0,1)',
                      borderWidth: 2,
                      data: this.data.map((j) => {
                        if (typeof(j.fish) === 'object'){
                          
                          return j.fish.reduce((acc, curr ) => {
                            if (curr.type === i){
                              return curr.weight + acc;
                            }
                            else{
                              return acc;
                            }
                          }, 0)
                        }
                      }).reverse()
                    }});
        
    }
    generateBarRows () {
        let tempBarRows = [];
        this.data.forEach(i => {
            if (typeof(i.fish) === 'object'){
              i.fish.forEach( j => {
                if(!tempBarRows.some( k => k === j.type )){
                    tempBarRows.push(j.type); 
                }
              })
            }
          });


        return tempBarRows;
    }

    generateBarLabels(){
        let barLabels = this.data.map((i)=>{ return normalizeDate(i.landingDate)});
        return barLabels.reverse();
    }

    generateBarData(){
        this.barRows = this.generateBarRows();

        return {
            labels: this.barLabels,
            datasets: this.generateBarDataShcema(),
        }
    }
}